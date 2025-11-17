import { pool } from '../config/db.js';

/**
 * Crea una nueva cita en la base de datos.
 */
export const create = async (citaData) => {
    const { fecha, hora, tipoCita, detalle, id_usuario, idMascota } = citaData;
    
    const query = `
        INSERT INTO citas (fecha, hora, tipo_cita, detalle, id_usuario, id_mascota)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *; 
    `;
    
    const values = [fecha, hora, tipoCita, detalle, id_usuario, idMascota];
    
    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error("Error en repositorio al crear cita:", error);
        throw error;
    }
};

/**
 * Busca todas las citas de un usuario específico.
 */
export const findByUserId = async (id_usuario) => {
    const query = `
        SELECT 
            c.id, 
            c.fecha, 
            c.hora, 
            c.tipo_cita, 
            c.detalle, 
            c.estado,
            m.nombre AS nombre_mascota 
        FROM 
            citas c
        JOIN 
            mascotas m ON c.id_mascota = m.id
        WHERE 
            c.id_usuario = $1
        ORDER BY 
            c.fecha DESC, c.hora DESC;
    `;
    
    try {
        const { rows } = await pool.query(query, [id_usuario]);
        return rows;
    } catch (error) {
        console.error("Error en repositorio al buscar citas por usuario:", error);
        throw error;
    }
};

/**
 * Elimina una cita.
 */
export const deleteById = async (id_cita, id_usuario) => {
    const query = `
        DELETE FROM citas 
        WHERE id = $1 AND id_usuario = $2
        RETURNING id;
    `;
    
    try {
        const { rowCount } = await pool.query(query, [id_cita, id_usuario]);
        return rowCount > 0;
    } catch (error) {
        console.error("Error en repositorio al borrar cita:", error);
        throw error;
    }
};