// src/app.ts
import express from 'express';
import taskRoutes from './routes/task.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

export const app = express();


app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error('[app] Error interno:', err);
  res.status(500).json({ error: err.message || 'Error interno' });
});
