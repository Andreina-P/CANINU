import { body, validationResult } from 'express-validator';

/**
 * Función middleware que maneja los errores de validación.
 * Si validationResult(req) encuentra errores, detiene la ejecución
 * y responde con un JSON 400. Si no hay errores, llama a next().
 * * @function handleValidationErrors
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware/controlador.
 * @returns {void}
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Si hay errores, responde con un error 400 (Bad Request)
        return res.status(400).json({ 
            success: false, 
            message: "Datos inválidos", 
            errors: errors.array() 
        });
    }
    next();
};

// Define la fecha máxima permitida para las citas (2 años en el futuro)
const maxDate = new Date();

/**
 * Conjunto de reglas de validación para el endpoint de creación de citas.
 * Se exporta como un array de middlewares que se ejecutan en secuencia.
 * * @type {Array<Function>}
 */
maxDate.setFullYear(maxDate.getFullYear() + 2); // 2 años en el futuro
// Reglas específicas para la creación de una cita
export const validateCitaCreation = [
    // 1. La fecha debe ser una fecha válida en formato YYYY-MM-DD
    body('fecha').isISO8601().withMessage('La fecha debe ser válida (YYYY-MM-DD)')
        // Comprueba que la fecha sea ANTES de la fecha máxima (2 años)
        .isBefore(maxDate.toISOString()).withMessage('La fecha no puede ser más de dos años en el futuro'),

    // 2. La hora debe estar en formato HH:MM
    body('hora').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('La hora debe ser válida (HH:MM)'),
    
    // 3. El tipo de cita debe ser una de las dos opciones
    body('tipoCita').isIn(['Medico', 'Estetico']).withMessage('El tipo de cita es inválido'),
    
    // 4. El detalle (motivo o servicio) no puede estar vacío
    body('detalle').notEmpty().withMessage('El detalle (motivo o servicio) no puede estar vacío'),
    
    // 5. El idMascota debe ser un número entero
    body('idMascota').isInt({ min: 1 }).withMessage('Debe seleccionar una mascota válida'),
    
    // 6. Ejecutar el manejador de errores
    handleValidationErrors
];