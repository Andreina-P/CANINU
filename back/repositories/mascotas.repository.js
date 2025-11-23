import {pool} from '../../config/db.js';

/**
 * Desactiva (eliminación lógica) una mascota por su ID.
 * Establece la columna 'activo' a FALSE para que ya no aparezca.
 * @function deactivatePet
 * @returns {Promise<number>} El número de filas afectadas (debería ser 1 si la mascota existe).
 * @throws {Error} Si ocurre un error durante la ejecución de la consulta.
 */
export async function deactivatePet(mascotaId) { // <<-- YA ESTÁ DEFINIDA
    const query = `
        UPDATE mascotas
        SET activo = FALSE
        WHERE id = $1
        RETURNING id;
    `;
    const result = await pool.query(query, [mascotaId]);
    return result.rowCount;
}

/**
 * Inserta una nueva mascota en la base de datos.
 * @param {object} data - Datos de la mascota (nombre, especie, raza, fecha_nacimiento).
 * @param {number} userId - ID del usuario que registra la mascota.
 * @returns {number} El ID de la mascota recién creada.
 */
export async function createPet(data, userId) {
    const { nombre, especie, raza, fecha_nacimiento, sexo, peso } = data;

    const query = `
        INSERT INTO mascotas (id_usuario, nombre, sexo, peso, especie, raza, fecha_nacimiento)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id;
    `;
    const values = [userId, nombre, sexo, peso || null, especie, raza || null, fecha_nacimiento || null];

    const result = await pool.query(query, values);
    return result.rows[0].id;
}

/**
 * Obtiene todas las mascotas de un usuario.
 * @param {number} userId - ID del usuario.
 * @returns {Array} Lista de objetos de mascotas.
 */
export async function getPetsByUserId(userId) {
    const query = `
        SELECT id, nombre, especie, raza, fecha_nacimiento, sexo, peso
        FROM mascotas
        WHERE id_usuario = $1
        AND activo = TRUE
        ORDER BY nombre;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
}
