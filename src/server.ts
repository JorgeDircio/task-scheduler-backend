import { app } from './app';
import { amqpHelper } from './common/helpers/amqp.helper';
import { PORT } from './config';


async function bootstrap() {
  await amqpHelper.init();
  const srv = app.listen(PORT, () => {
    console.log(`API escuchando en puerto ${PORT}`);
  });

  process.on('SIGINT', async () => {
    console.log('Cerrando infra y servidor…');
    await amqpHelper.close();
    srv.close(() => process.exit(0));
  });
}

bootstrap().catch(err => {
  console.error('Error en bootstrap:', err);
  process.exit(1);
});
