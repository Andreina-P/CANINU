import { Router } from 'express';
import { pool } from '../../config/db.js';

import { createPet, getPetsByUserId, deactivatePet } from '../repositories/mascotas.repository.js'; 

const router = Router();

/**
 * Middleware para verificar si existe una sesión de usuario válida.
 * Si es exitoso, añade el ID del usuario a `req.id_usuario`.
 * * @function verificarSesion
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware/controlador.
 * @returns {void}
 */
const verificarSesion = (req, res, next) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ success: false, message: 'No autorizado.' });
    }
    req.id_usuario = req.session.user.id;
    next();
};
router.use(verificarSesion);

/**
 * DESACTIVAR MASCOTA: Endpoint para desactivar (eliminación lógica) una mascota por su ID.
 * * @name PUT /deactivate/:id
 * @function
 * @memberof module:routes/mascotas
 * @param {string} :id - ID de la mascota a desactivar (en params).
 */
router.put('/deactivate/:id', async (req, res) => {
    try {
        const mascotaId = req.params.id;
        const rowsAffected = await deactivatePet(mascotaId); 

        if (rowsAffected === 0) {
            // Nota: Podría ser 403 si se valida la propiedad del usuario, pero 404 es común.
            return res.status(404).json({ success: false, message: 'Mascota no encontrada o ya desactivada.' });
        }
        
        res.status(200).json({ success: true, message: 'Mascota desactivada correctamente.' });

    } catch (error) {
        console.error('Error al desactivar mascota:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al desactivar mascota.' });
    }
});

/**
 * CREAR MASCOTA: Endpoint para crear una nueva mascota asociada al usuario autenticado.
 * * @name POST /
 * @function
 * @memberof module:routes/mascotas
 * @param {object} req.body - Datos de la mascota (nombre, especie, sexo, etc.).
 */
router.post('/', async (req, res) => {
    try {
        const userId = req.id_usuario;
        const data = req.body;
        
        if (!data.nombre || data.nombre.trim() === '' || 
            !data.especie || data.especie.trim() === '' ||
            !data.sexo || data.sexo.trim() === '') { // <<-- AÑADIDO: Verifica que 'sexo' no sea nulo ni cadena vacía
            
            return res.status(400).json({ success: false, message: 'Nombre, especie y sexo son campos obligatorios.' });
        }

        const mascotaId = await createPet(data, userId);
        
        res.status(201).json({ success: true, message: 'Mascota registrada.', mascotaId });

    } catch (error) {
        console.error('Error al registrar mascota:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al registrar mascota.' });
    }
});

/**
 * OBTENER MASCOTAS: Endpoint para obtener la lista de mascotas activas del usuario autenticado.
 * * @name GET /mis-mascotas
 * @function
 * @memberof module:routes/mascotas
 */
router.get('/mis-mascotas', async (req, res) => {
    try {
        const mascotas = await getPetsByUserId(req.id_usuario);
        res.status(200).json({ success: true, data: mascotas });
    } catch (error) {
        // Mejorar el manejo de errores
        console.error('Error al obtener mascotas:', error);
        res.status(500).json({ success: false, message: 'Error interno al obtener mascotas.' });
    }
});

/**
 * Controlador de desactiva una mascota.
 */
/**export const deactivatePetController = async (req, res) => {
    try {
        // El ID de la mascota viene en los parámetros de la URL
        const mascotaId = req.params.id; 
        
        // Opcional y recomendado: Validar que la mascota pertenece a req.usuario.id
        // Para simplificar, asumiremos que la seguridad se maneja en el router, 
        // pero idealmente el repositorio debería validar también el userId.

        // Llama a la función del repositorio (que ya existe en mascotas.repository.js)
        const rowsAffected = await deactivatePet(mascotaId); //

        if (rowsAffected === 0) {
            // Si rowsAffected es 0, la mascota no existía o ya estaba inactiva.
            return res.status(404).json({ success: false, message: 'Mascota no encontrada o ya estaba desactivada.' });
        }
        
        res.status(200).json({ success: true, message: 'Mascota desactivada correctamente.' });

    } catch (error) {
        console.error("Error en deactivatePetController:", error.message);
        res.status(500).json({ success: false, message: "Error interno del servidor al desactivar la mascota." });
    }
};
 */
export default router;