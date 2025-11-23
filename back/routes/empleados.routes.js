import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

/**
 * Middleware para restringir el acceso solo a usuarios con rol 'admin'.
 * * @function soloAdmin
 * @param {object} req - Objeto de solicitud de Express.
 * @returns {void}
 */
function soloAdmin(req, res, next) {
    if (!req.session.user || req.session.user.rol !== "admin") {
        return res.status(403).json({ success: false, message: "Acceso denegado" });
    }
    next();
}

/**
 * OBTENR TODOS LOS EMPLEADOS: Endpoint para obtener la lista de todos los usuarios con rol 'empleado'.
 * Requiere autorización de administrador (`soloAdmin`).
 * * @name GET /
 * @function
 * @memberof module:routes/empleados
 */
router.get("/", soloAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, username, email, rol, fecha_creacion, estado FROM usuarios WHERE rol = 'empleado' ORDER BY id ASC"
        );
        res.json({ success: true, empleados: result.rows });

    } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
});

/**
 * CREAR NUEVO EMPLEADO: Endpoint para registrar un nuevo usuario con rol 'empleado'.
 * Requiere autorización de administrador (`soloAdmin`).
 * * @name POST /
 * @function
 * @memberof module:routes/empleados
 * @param {string} username - Nombre de usuario.
 * @param {string} email - Correo electrónico (debe ser único).
 * @param {string} password - Contraseña.
 */
router.post("/", soloAdmin, async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.json({ success: false, message: "Todos los campos son obligatorios" });
    }

    try {
        const check = await pool.query("SELECT email FROM usuarios WHERE email = $1", [email]);
        if (check.rowCount > 0) {
            return res.json({ success: false, message: "El email ya está registrado" });
        }

        await pool.query(
            `INSERT INTO usuarios (username, email, password, rol)
             VALUES ($1, $2, $3, 'empleado')`,
            [username, email, password]
        );

        res.json({ success: true, message: "Empleado creado correctamente" });

    } catch (error) {
        console.error("Error al crear empleado:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
});

/**
 * ACTUALIZAR EMPLEADO: Endpoint para actualizar la información de un empleado existente.
 * Requiere autorización de administrador (`soloAdmin`).
 * * @name PUT /:id
 * @function
 * @memberof module:routes/empleados
 * @param {number} id - ID del empleado a actualizar (en params).
 * @param {string} username - Nuevo nombre de usuario.
 * @param {string} email - Nuevo correo electrónico.
 * @param {string} password - Nueva contraseña.
 */
router.put("/:id", soloAdmin, async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    try {
        const result = await pool.query(
            `UPDATE usuarios 
             SET username = $1, email = $2, password = $3 
             WHERE id = $4 AND rol = 'empleado'`,
            [username, email, password, id]
        );

        if (result.rowCount === 0) {
            return res.json({ success: false, message: "Empleado no encontrado" });
        }

        res.json({ success: true, message: "Empleado actualizado" });

    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
});

/**
 * ELIMINAR EMPLEADO: Endpoint para eliminar un empleado por su ID.
 * Requiere autorización de administrador (`soloAdmin`).
 * * @name DELETE /:id
 * @function
 * @memberof module:routes/empleados
 * @param {number} id - ID del empleado a eliminar (en params).
 */
router.delete("/:id", soloAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            "DELETE FROM usuarios WHERE id = $1 AND rol = 'empleado'",
            [id]
        );

        if (result.rowCount === 0) {
            return res.json({ success: false, message: "Empleado no encontrado" });
        }

        res.json({ success: true, message: "Empleado eliminado" });

    } catch (error) {
        console.error("Error al eliminar empleado:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
});

export default router;
