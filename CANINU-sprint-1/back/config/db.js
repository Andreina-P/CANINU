import dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;

// Cargar variables de entorno
dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT)
});

pool.on('connect', () => {
  console.log('Conectado a la base de datos PostgreSQL');
});