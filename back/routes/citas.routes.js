import { Router } from 'express';
import * as CitasRepository from '../repositories/citas.repository.js';

import { validateCitaCreation } from '../middleware/validation.middleware.js';

const router = Router();

const verificarSesion = (req, res, next) => {
// ... (código existente, sin cambios) ...
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ success: false, message: 'No autorizado. Debe iniciar sesión.' });
    }
    req.id_usuario = req.session.user.id;
    next();
};

router.use(verificarSesion);

// --- 2. APLICAR LAS VALIDACIONES AL CREAR CITA ---
router.post('/', validateCitaCreation, async (req, res) => {
    try {
        // --- 3. LÓGICA DE DUPLICADOS ---
        const { fecha, hora, idMascota } = req.body;
        
        const citaExistente = await CitasRepository.findByPetAndDateTime(idMascota, fecha, hora);
        
        if (citaExistente) {
            // Error 409 (Conflict) es el estándar para "recurso duplicado"
            return res.status(409).json({ 
                success: false, 
                message: 'Ya tienes una cita para esta mascota en la misma fecha y hora.' 
            });
        }

        // Si pasa las validaciones, creamos la cita
        const citaData = {
            ...req.body,
            id_usuario: req.id_usuario 
        };

        const nuevaCita = await CitasRepository.create(citaData);
        res.status(201).json({ success: true, data: nuevaCita });

    } catch (error) {
        console.error("Error en router al crear cita:", error); // Logueamos el error
        res.status(500).json({ success: false, message: 'Error interno al crear la cita.' });
    }
});

// GET /api/citas/mis-citas
// Obtener todas las citas del usuario logueado
router.get('/mis-citas', async (req, res) => {
    try {
        const citas = await CitasRepository.findByUserId(req.id_usuario);
        res.status(200).json({ success: true, data: citas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno al obtener las citas.' });
    }
});

// DELETE /api/citas/:id
// Borrar una cita (para la página de "Ver Citas")
router.delete('/:id', async (req, res) => {
    try {
        const id_cita = req.params.id;
        const success = await CitasRepository.deleteById(id_cita, req.id_usuario);
        
        if (success) {
            res.status(200).json({ success: true, message: 'Cita cancelada exitosamente.' });
        } else {
            // Esto pasa si la cita no existe o no le pertenece al usuario
            res.status(404).json({ success: false, message: 'Cita no encontrada o no le pertenece.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno al cancelar la cita.' });
    }
});

export default router;