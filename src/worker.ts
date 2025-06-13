import { amqpHelper } from './common/helpers/amqp.helper'
import { ConsumeMessage } from 'amqplib'
import { TaskModel } from './models/task.model'
import { QUEUE_MESSAGE_NAMES } from './common/constants'
import { calculateSJFWithPriority } from './services/scheduler.service'

async function startWorker() {
    const chan = await amqpHelper.init()

    // Worker de creación de tareas
    await chan.assertQueue(QUEUE_MESSAGE_NAMES.TASK_CREATE, { durable: true })
    chan.prefetch(1)
    console.log('Worker escuchando en', QUEUE_MESSAGE_NAMES.TASK_CREATE)
    chan.consume(
        QUEUE_MESSAGE_NAMES.TASK_CREATE,
        async (msg: ConsumeMessage | null) => {
            if (!msg) return

            const { name, arrival_time, duration, priority } = JSON.parse(msg.content.toString())
            await TaskModel.create({ name, arrival_time, duration, priority })

            chan.ack(msg)
            console.log(`Worker procesó e insertó tarea ${name}`)
        },
        { noAck: false }
    )

    // Worker de listado de tareas
    await chan.assertQueue(QUEUE_MESSAGE_NAMES.TASK_LIST, { durable: true })
    chan.prefetch(1)
    console.log('Worker escuchando en', QUEUE_MESSAGE_NAMES.TASK_LIST)
    chan.consume(
        QUEUE_MESSAGE_NAMES.TASK_LIST,
        async (msg: ConsumeMessage | null) => {
            if (!msg) return

            try {
                const tasks = await TaskModel.findAll()
                const replyTo = msg.properties.replyTo
                const corrId = msg.properties.correlationId

                if (replyTo && corrId) {
                    const payload = Buffer.from(JSON.stringify(tasks))
                    chan.sendToQueue(replyTo, payload, { correlationId: corrId })
                }

                chan.ack(msg)
                console.log(`Worker respondió con ${tasks.length} tareas`)
            } catch (err) {
                console.error('Error en worker de list:', err)
                chan.ack(msg)
            }
        },
        { noAck: false }
    )

    // Worker de eliminado de tareas por id
    await chan.assertQueue(QUEUE_MESSAGE_NAMES.TASK_DELETE_BY_ID, { durable: true })
    chan.consume(QUEUE_MESSAGE_NAMES.TASK_DELETE_BY_ID, async (msg: ConsumeMessage | null) => {
        if (!msg) return
        const { id } = JSON.parse(msg.content.toString())
        await TaskModel.deleteById(id)
        chan.ack(msg)
        console.log(`Worker eliminó tarea ${id}`)
    }, { noAck: false })

    // Worker task schedule
    await chan.assertQueue(QUEUE_MESSAGE_NAMES.TASK_SCHEDULE, { durable: true })
    chan.consume(
        QUEUE_MESSAGE_NAMES.TASK_SCHEDULE,
        async (msg: ConsumeMessage | null) => {
            if (!msg) return

            try {
                const tasks = await TaskModel.findAll()
                const ordered = calculateSJFWithPriority(tasks);
                const replyTo = msg.properties.replyTo
                const corrId = msg.properties.correlationId

                if (replyTo && corrId) {
                    const payload = Buffer.from(JSON.stringify(ordered))
                    chan.sendToQueue(replyTo, payload, { correlationId: corrId })
                }

                chan.ack(msg)
                console.log(`Worker respondió con ${ordered.length} tareas`)
            } catch (err) {
                console.error('Error en worker de schedule:', err)
                chan.ack(msg)
            }
        },
        { noAck: false }
    )

    // Worker task GET BY ID
    await chan.assertQueue(QUEUE_MESSAGE_NAMES.TASK_GET_BY_ID, { durable: true })
    chan.consume(
        QUEUE_MESSAGE_NAMES.TASK_GET_BY_ID,
        async (msg: ConsumeMessage | null) => {
            if (!msg) return

            try {
                const { id } = JSON.parse(msg.content.toString());
                const task = await TaskModel.findById(id);
                const replyTo = msg.properties.replyTo
                const corrId = msg.properties.correlationId

                if (replyTo && corrId) {
                    const payload = Buffer.from(JSON.stringify(task))
                    chan.sendToQueue(replyTo, payload, { correlationId: corrId })
                }

                chan.ack(msg)
                console.log(`Worker respondió con la tarea ${task}`)
            } catch (err) {
                console.error('Error en worker de list by id:', err)
                chan.ack(msg)
            }
        },
        { noAck: false }
    )

    // Worker delete all tasks
    await chan.assertQueue(QUEUE_MESSAGE_NAMES.TASK_DELETE, { durable: true })
    chan.consume(
        QUEUE_MESSAGE_NAMES.TASK_DELETE,
        async (msg: ConsumeMessage | null) => {
            if (!msg) return

            try {
                const count = await TaskModel.deleteAll();
                const replyTo = msg.properties.replyTo
                const corrId = msg.properties.correlationId

                if (replyTo && corrId) {
                    const payload = Buffer.from(JSON.stringify(count))
                    chan.sendToQueue(replyTo, payload, { correlationId: corrId })
                }

                chan.ack(msg)
                console.log(`Worker elimino ${count} tasks`)
            } catch (err) {
                console.error('Error en worker de delete all:', err)
                chan.ack(msg)
            }
        },
        { noAck: false }
    )

}

startWorker().catch(err => {
    console.error('Worker error:', err)
    process.exit(1)
})
