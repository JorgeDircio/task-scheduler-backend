import { Options } from 'swagger-jsdoc';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition: Options['definition'] = {
  openapi: '3.0.0',
  info: {
    title: 'Task Scheduler API',
    version: '1.0.0',
    description: 'API para gestionar y ordenar tareas (SJF).',
  },
  servers: [
    { url: 'http://localhost:3000/api', description: 'Servidor local' }
  ],
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
});
