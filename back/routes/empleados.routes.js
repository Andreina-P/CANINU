import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();


function soloAdmin(req, res, next) {
    if (!req.session.user || req.session.user.rol !== "admin") {
        return res.status(403).json({ success: false, message: "Acceso denegado" });
    }
    next();
}


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



router.delete("/:id", soloAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE usuarios
            SET Estado = False
            WHERE id = $1 AND rol = 'empleado';`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.json({ success: false, message: "Empleado no encontrado" });
        }

        res.json({ success: true, message: "Empleado desactivado" });

    } catch (error) {
        console.error("Error al desactivar empleado:", error);
        res.status(500).json({ success: false, message: "Error interno" });
    }
});

export default router;
