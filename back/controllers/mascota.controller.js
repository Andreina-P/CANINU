// back/controllers/mascota.controller.js

// Asume que la función protect añade req.usuario.id
// Asume que el repositorio tiene la función createPet
import { createPet, getPetsByUserId } from '../repositories/mascotas.repository.js'; 
// import { validationResult } from 'express-validator'; // Para usar con el middleware

export const createPetController = async (req, res) => {
    // Si usas express-validator:
    /*
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    */
    
    try {
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

export const getMyPetsController = async (req, res) => {
    try {
        const userId = req.usuario.id;
        const mascotas = await getPetsByUserId(userId);
        res.status(200).json({ success: true, data: mascotas });
    } catch (error) {
        console.error("Error en getMyPetsController:", error.message);
        res.status(500).json({ success: false, message: "Error al cargar las mascotas." });
    }
};