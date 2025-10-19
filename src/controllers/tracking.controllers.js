const catchError = require('../utils/catchError');
const { getLatestLocation, getVehicleHistory } = require('../services/tracking.services');

// 🔹 1. Obtener la última ubicación de un vehículo específico
const getLatest = catchError(async (req, res) => {
    // El 'vehicleId' viene de los parámetros de la ruta (ej: /tracking/latest/1)
    const { vehicleId } = req.params; 
    
    // Llamamos al servicio
    const result = await getLatestLocation(vehicleId);
    
    if (!result) return res.status(404).json({ message: 'Ubicación no disponible para el vehículo.' });
    
    return res.json(result);
});

// 🔹 2. Obtener historial de ubicaciones para un período de tiempo
const getHistory = catchError(async (req, res) => {
    const { vehicleId } = req.params;
    
    // Las fechas de inicio y fin se esperan en la query string 
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({ message: 'Se requieren fechas de inicio (start) y fin (end) en formato YYYY-MM-DD.' });
    }

    const results = await getVehicleHistory(vehicleId, start, end);
    
    // Devolver el historial (será un array de objetos lat/lon)
    return res.json(results);
});


module.exports = {
    getLatest,
    getHistory,
};