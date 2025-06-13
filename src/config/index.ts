import dotenv from 'dotenv';
dotenv.config();
export const PORT = process.env.PORT || 3000;
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
export const PG_CONFIG = {
  host: process.env.PGHOST!,
  user: process.env.PGUSER!,
  password: process.env.PGPASSWORD!,
  database: process.env.PGDATABASE!,
  port: Number(process.env.PGPORT!),
};
