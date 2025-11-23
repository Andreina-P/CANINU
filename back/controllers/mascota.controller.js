import { createPet, getPetsByUserId } from '../repositories/mascotas.repository.js';

/**
 * Controlador para el registro de una nueva mascota.
 * Requiere que el usuario esté autenticado (req.usuario.id).
 * * @async
 * @function createPetController
 * @param {object} req - Objeto de solicitud de Express. Se espera { nombre, especie, ... } en req.body.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta HTTP 201 si es exitoso o 400/500 si falla.
 */
export const createPetController = async (req, res) => {   
    try {
        // Asume que el middleware de autenticación (protect) añade req.usuario.id
        const data = req.body;
        const userId = req.usuario.id; 

        // 1. Validaciones básicas antes de llamar al repositorio
        if (!data.nombre || !data.especie || !userId) {
            return res.status(400).json({ success: false, message: "Nombre, especie e ID de usuario son obligatorios." });
        }

        // 2. Llama a la función del repositorio para la inserción
        const mascotaId = await createPet(data, userId);

        res.status(201).json({ 
            success: true, 
            message: "Mascota registrada exitosamente.", 
            mascotaId 
        });

    } catch (error) {
        console.error("Error en createPetController:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor al registrar la mascota." 
        });
    }
};

/**
 * Controlador para obtener todas las mascotas asociadas al usuario autenticado.
 * Requiere que el usuario esté autenticado (req.usuario.id).
 * * @async
 * @function getMyPetsController
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta HTTP 200 con el listado de mascotas o 500 si falla.
 */
export const getMyPetsController = async (req, res) => {
    try {
        // Asume que el middleware de autenticación (protect) añade req.usuario.id
        const userId = req.usuario.id;

        // 1. Llama a la función del repositorio para obtener las mascotas
        const mascotas = await getPetsByUserId(userId);
        res.status(200).json({ success: true, data: mascotas });
    } catch (error) {
        console.error("Error en getMyPetsController:", error.message);
        res.status(500).json({ success: false, message: "Error al cargar las mascotas." });
    }
};