import { Router } from 'express';
import * as MascotasRepository from '../repositories/mascotas.repository.js';

const router = Router();

// Middleware de seguridad
const verificarSesion = (req, res, next) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ success: false, message: 'No autorizado.' });
    }
    req.id_usuario = req.session.user.id;
    next();
};
router.use(verificarSesion);

// GET /api/mascotas/mis-mascotas
// Obtener todas las mascotas del usuario logueado
router.get('/mis-mascotas', async (req, res) => {
    try {
        const mascotas = await MascotasRepository.findByUserId(req.id_usuario);
        res.status(200).json({ success: true, data: mascotas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno al obtener mascotas.' });
    }
});

export default router;