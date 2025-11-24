import { pool } from '../../config/db.js';

/**
 * CREAR CITA: Inserta una nueva cita en la base de datos.
 * * @async
 * @function create
 * @returns {Promise<object>} El objeto de la cita recién creada con el ID asignado.
 * @throws {Error} Si ocurre un error durante la ejecución de la consulta.
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
 * VERIFICAR CITA DUPLICADA: Busca si ya existe una cita para una mascota en una fecha y hora específicas.
 * @function findByPetAndDateTime
 * @returns {Promise<object|undefined>} El objeto de la cita encontrada (con solo el ID) o undefined si no existe.
 * @throws {Error} Si ocurre un error durante la ejecución de la consulta.
 */
export const findByPetAndDateTime = async (id_mascota, fecha, hora) => {
    const query = `
        SELECT id FROM citas 
        WHERE id_mascota = $1 AND fecha = $2 AND hora = $3
    `;

    try {
        const { rows } = await pool.query(query, [id_mascota, fecha, hora]);
        return rows[0];
    } catch (error) {
        console.error("Error en repositorio al buscar cita duplicada:", error);
        throw error;
    }
};

/**
 * OBTENR CITAS POR USUARIO: Obtiene todas las citas de un usuario específico, incluyendo el nombre de la mascota.
 * @function findByUserId
 * @returns {Promise<Array<object>>} Un array de objetos de citas.
 * @throws {Error} Si ocurre un error durante la ejecución de la consulta.
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
 * ELIMINAR CITA: Elimina una cita específica, verificando que pertenezca al usuario que intenta borrarla.
 * @function deleteById
 * @returns {Promise<boolean>} Retorna true si se eliminó una fila, false si no se encontró o no pertenecía al usuario.
 * @throws {Error} Si ocurre un error durante la ejecución de la consulta.
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

/**
 * CITAS QUE NO TIENEN EMPLEADO: Obtiene todas las citas que aún no tienen un empleado (veterinario/estilista) asignado.
 * @function obtenerCitasPendientes
 * @returns {Promise<Array<object>>} Un array de objetos de citas pendientes.
 * @throws {Error} Si ocurre un error durante la ejecución de la consulta.
 */
export const obtenerCitasPendientes = async () => {
    const query = `
        SELECT *
        FROM public."citas"
        WHERE id_empleado IS NULL;
    `;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error en repositorio al obtener citas pendientes:", error);
        throw error;
    }
};

/**
 * ASIGNAR EMPLEADO A UNA CITA: Actualiza una cita para asignarle un empleado específico.
 * @function asignarEmpleado
 * @returns {Promise<object|null>} El objeto de la cita actualizada, o null si no se encontró la cita.
 * @throws {Error} Si ocurre un error durante la ejecución de la consulta.
 */
export const asignarEmpleado = async (id_cita, id_empleado) => {
    const query = `
        UPDATE citas 
        SET id_empleado = $1
        WHERE id = $2
        RETURNING *;
    `;

    try {
        const { rows } = await pool.query(query, [id_empleado, id_cita]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error en repositorio al asignar empleado:", error);
        throw error;
    }
};

/**
 * CITAS ASIGNADAS A UN EMPLEADO: Obtiene todas las citas asignadas a un empleado específico.
 * @function findByEmpleadoId
 * @returns {Promise<Array<object>>} Un array de objetos de citas asignadas al empleado.
 * @throws {Error} Si ocurre un error durante la ejecución de la consulta.
 */
export const findByEmpleadoId = async (id_empleado) => {
    const query = `
        SELECT 
            c.id, 
            c.fecha, 
            c.hora, 
            c.tipo_cita, 
            c.detalle, 
            c.estado,
            c.observaciones,
            c.id_mascota,
            c.id_usuario,
            m.nombre AS nombre_mascota,   -- Traemos el nombre de la tabla mascotas
            u.username AS nombre_cliente  -- Traemos el nombre de la tabla usuarios
        FROM 
            citas c
        JOIN 
            mascotas m ON c.id_mascota = m.id
        JOIN 
            usuarios u ON c.id_usuario = u.id
        WHERE 
            c.id_empleado = $1  
        ORDER BY 
            c.fecha ASC, c.hora ASC;
    `;
    
    try {
        const { rows } = await pool.query(query, [id_empleado]);
        return rows;
    } catch (error) {
        console.error("Error en repositorio al buscar citas por empleado:", error);
        throw error;
    }
};

/**
 * ACTUALIZAR CITA (Estado y Observaciones)
 * Usa COALESCE para actualizar solo lo que enviemos, manteniendo lo demás igual.
 */
export const update = async (id_cita, updateData) => {
    const { estado, observaciones } = updateData;
    
    const query = `
        UPDATE citas
        SET 
            estado = COALESCE($1, estado),
            observaciones = COALESCE($2, observaciones)
        WHERE id = $3
        RETURNING *;
    `;
    
    const values = [estado, observaciones, id_cita];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0]; // Devuelve la cita actualizada o undefined
    } catch (error) {
        console.error("Error actualizando cita:", error);
        throw error;
    }
};
