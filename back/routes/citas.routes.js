import { Router } from 'express';
import * as CitasRepository from '../repositories/citas.repository.js';

const router = Router();

// Nos aseguramos de que solo usuarios logueados puedan usar estas rutas.
const verificarSesion = (req, res, next) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ success: false, message: 'No autorizado. Debe iniciar sesión.' });
    }
    // Si tiene sesión, guardamos el id para usarlo más fácil
    req.id_usuario = req.session.user.id;
    next();
};

// Aplicamos el middleware a TODAS las rutas de este archivo
router.use(verificarSesion);


// --- CRUD de Citas ---

// POST /api/citas/
// Crear una nueva cita
router.post('/', async (req, res) => {
    try {
        // Combinamos datos del formulario (req.body) con el id del usuario (de la sesión)
        const citaData = {
            ...req.body,
            id_usuario: req.id_usuario 
        };

        const nuevaCita = await CitasRepository.create(citaData);
        res.status(201).json({ success: true, data: nuevaCita });
    } catch (error) {
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