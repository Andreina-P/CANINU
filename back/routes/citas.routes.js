import { pool } from '../../config/db.js';

import { Router } from 'express';
import * as CitasRepository from '../repositories/citas.repository.js';
import { obtenerCitasPendientes, asignarEmpleado, findByEmpleadoId } from '../repositories/citas.repository.js';
import { validateCitaCreation } from '../middleware/validation.middleware.js';

const router = Router();

/**
 * Middleware para verificar si existe una sesión de usuario válida.
 * Si la sesión es válida, añade el ID del usuario a `req.id_usuario` para su uso posterior.
 * * @function verificarSesion
 * @returns {void}
 */
const verificarSesion = (req, res, next) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ success: false, message: 'No autorizado. Debe iniciar sesión.' });
    }
    req.id_usuario = req.session.user.id;
    next();
};

router.use(verificarSesion);

/**
 * CREAR CITA:Endpoint para crear una nueva cita.
 * Aplica el middleware de validación `validateCitaCreation`.
 * Además, verifica si ya existe una cita para la misma mascota en la misma fecha/hora.
 * * @name POST /
 * @function
 * @memberof module:routes/citas
 */
router.post('/', validateCitaCreation, async (req, res) => {
    try {
        const { fecha, hora, idMascota } = req.body;
        
        const citaExistente = await CitasRepository.findByPetAndDateTime(
            idMascota, 
            fecha, 
            hora
        );
        
        if (citaExistente) {
            return res.status(409).json({ 
                success: false, 
                message: 'Ya tienes una cita para esta mascota en la misma fecha y hora.' 
            });
        }

        const citaData = {
            ...req.body,
            id_usuario: req.id_usuario 
        };

        const nuevaCita = await CitasRepository.create(citaData);
        res.status(201).json({ success: true, data: nuevaCita });

    } catch (error) {
        console.error("Error en router al crear cita:", error);
        res.status(500).json({ success: false, message: 'Error interno al crear la cita.' });
    }
});

/**
 * OBTENER CITA: Endpoint para obtener todas las citas del usuario autenticado.
 * * @name GET /mis-citas
 * @function
 * @memberof module:routes/citas
 */
router.get('/mis-citas', async (req, res) => {
    try {
        const citas = await CitasRepository.findByUserId(req.id_usuario);
        res.status(200).json({ success: true, data: citas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno al obtener las citas.' });
    }
});

/**
 * ELIMINAR CITA: Endpoint para eliminar (cancelar) una cita.
 * Verifica que la cita pertenezca al usuario autenticado antes de eliminar.
 * * @name DELETE /:id
 * @function
 * @memberof module:routes/citas
 */
router.delete('/:id', async (req, res) => {
    try {
        const id_cita = req.params.id;
        const success = await CitasRepository.deleteById(id_cita, req.id_usuario);
        
        if (success) {
            res.status(200).json({ success: true, message: 'Cita cancelada exitosamente.' });
        } else {
            res.status(404).json({ success: false, message: 'Cita no encontrada o no le pertenece.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno al cancelar la cita.' });
    }
});

/**
 * OBTENER CITAS PENDIENTES (SIN EMPLEADO): Endpoint para obtener citas que no tienen empleado asignado. (Uso para Administrador/Empleado).
 * * @name GET /citas-pendientes
 * @function
 * @memberof module:routes/citas
 */
router.get("/citas-pendientes", async (req, res) => {
    try {
        const citas = await obtenerCitasPendientes();

        res.json({
            success: true,
            citas
        });

    } catch (error) {
        console.error("Error al obtener citas pendientes:", error);
        res.status(500).json({ success: false, message: "Error del servidor" });
    }
});

/**
 * ASIGNAR EMPLEADO A CITA: Endpoint para asignar un empleado a una cita específica. (Uso para Administrador).
 * * @name PUT /asignar-empleado
 * @function
 * @memberof module:routes/citas
 * @param {number} id_empleado - ID del empleado a asignar.
 * @param {number} id_cita - ID de la cita a actualizar.
 */
router.put("/asignar-empleado", async (req, res) => {
    try {
        const { id_empleado, id_cita } = req.body;

        if (!id_empleado || !id_cita) {
            return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
        }

        const citaActualizada = await asignarEmpleado(id_cita, id_empleado);

        if (!citaActualizada) {
            return res.status(404).json({ success: false, message: "Cita no encontrada" });
        }

        res.json({
            success: true,
            message: "Empleado asignado correctamente",
            cita: citaActualizada
        });

    } catch (err) {
        console.error("Error en ruta:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
});

/**
 * OBTENER CITAS ASIGNADAS AL EMPLEADO: Endpoint para obtener las citas asignadas al empleado autenticado.
 * Requiere que el usuario tenga el rol de 'empleado'.
 * * @name GET /asignadas
 * @function
 * @memberof module:routes/citas
 */
router.get('/asignadas', async (req, res) => {
    try {
        const id_empleado = req.id_usuario; // Obtenido del middleware verificarSesion

        if (req.session.user.rol !== 'empleado') {
             return res.status(403).json({ success: false, message: 'Acceso denegado.' });
        }

        const citas = await findByEmpleadoId(id_empleado); // Llama a la nueva función
        
        res.status(200).json({ success: true, data: citas });
    } catch (error) {
        console.error("Error al obtener citas asignadas:", error);
        res.status(500).json({ success: false, message: 'Error interno al obtener las citas asignadas.' });
    }
});

export default router;