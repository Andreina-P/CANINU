import dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;

// Cargar variables de entorno desde el archivo .env
dotenv.config();

/**
 * Instancia del Pool de Conexión a PostgreSQL.
 * Las credenciales se obtienen de las variables de entorno:
 * DB_USER, DB_SERVER (host), DB_DATABASE, DB_PASSWORD, DB_PORT.
 * * @type {Pool}
 */
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  // Asegura que el puerto se maneje como un número, no como una cadena
  port: Number(process.env.DB_PORT)
});

/**
 * Escucha el evento 'connect' para confirmar que la conexión inicial se estableció.
 */
pool.on('connect', () => {
  console.log('Conectado a la base de datos PostgreSQL');
});