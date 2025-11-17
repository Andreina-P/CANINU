import { pool } from '../config/db.js';

/**
 * Busca todas las mascotas de un usuario específico.
 */
export const findByUserId = async (id_usuario) => {
    const query = `
        SELECT id, nombre 
        FROM mascotas 
        WHERE id_usuario = $1 
        ORDER BY nombre;
    `;
    
    try {
        const { rows } = await pool.query(query, [id_usuario]);
        return rows;
    } catch (error) {
        console.error("Error en repositorio al buscar mascotas por usuario:", error);
        throw error;
    }
};