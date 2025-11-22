import { pool } from '../config/db.js';


/* ================================
   CREAR CITA
================================ */
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

/* ================================
   VERIFICAR CITA DUPLICADA
================================ */
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

/* ================================
   OBTENER CITAS POR USUARIO
================================ */
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

/* ================================
   ELIMINAR CITA
================================ */
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

/* ================================
   CITAS QUE NO TIENEN EMPLEADO
================================ */
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

/* ================================
   ASIGNAR EMPLEADO A UNA CITA
================================ */
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

/* ================================
   OBTENER CITAS POR EMPLEADO (find by id_empleado)
================================ */
export const findByEmpleadoId = async (id_empleado) => {
    const query = `
        SELECT 
            c.id, 
            c.fecha, 
            c.hora, 
            c.tipo_cita, 
            c.detalle, 
            c.estado,
            c.id_mascota,
            c.id_usuario
        FROM 
            citas c
        WHERE 
            c.id_empleado = $1  -- Filtra por el id_empleado
        ORDER BY 
            c.fecha ASC, c.hora ASC;
    `;
    
    try {
        const { rows } = await pool.query(query, [id_empleado]);
        // Las columnas de datos que devuelve son: 
        // id, fecha, hora, tipo_cita, detalle, estado, id_mascota, id_usuario
        return rows;
    } catch (error) {
        console.error("Error en repositorio al buscar citas por empleado:", error);
        throw error;
    }
};