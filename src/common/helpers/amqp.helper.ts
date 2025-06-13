import { connect, ChannelModel, Channel, Options } from 'amqplib'
import { RABBITMQ_URL } from '../../config'

class AmqpHelper {
  private conn!: ChannelModel
  private chan!: Channel

  public async init(): Promise<Channel> {
    if (!this.conn || !this.chan) {
      this.conn = await connect(RABBITMQ_URL)
      this.chan = await this.conn.createChannel()
    }
    return this.chan
  }

  async publish(queue: string, msg: any, opts?: Options.Publish) {
    const chan = await this.init()
    await chan.assertQueue(queue, { durable: true })
    chan.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
      persistent: true,
      ...opts,
    })
  }

  async rpcCall(queue: string, payload: any = '', timeout = 5000): Promise<Buffer> {
    const chan = await this.init()
    await chan.assertQueue(queue, { durable: true })

    const { queue: replyQ } = await chan.assertQueue('', { exclusive: true })
    const corrId = Date.now().toString()

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('RPC timeout')), timeout)

      chan.consume(
        replyQ,
        (msg) => {
          if (msg?.properties.correlationId === corrId) {
            clearTimeout(timer)
            resolve(msg.content)
          }
        },
        { noAck: true }
      )

      chan.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
        correlationId: corrId,
        replyTo: replyQ,
      })
    })
  }

  async close() {
    await this.chan.close()
    await this.conn.close()
  }
}

export const amqpHelper = new AmqpHelper()
