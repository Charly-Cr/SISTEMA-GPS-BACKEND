const { tracking } = require('../models');
const sequelize = require('sequelize');

// Función auxiliar: Convierte el complejo objeto GEOMETRY en un simple par lat/lon.
const formatTrackingRecord = (trackingRecord) => {
    if (!trackingRecord || !trackingRecord.location) return null;

    // 🚨 PostGIS/Sequelize almacena las coordenadas como [LONGITUDE, LATITUDE]
    const longitude = trackingRecord.location.coordinates[0];
    const latitude = trackingRecord.location.coordinates[1];
    
    // Excluir el objeto 'location' complejo para una respuesta limpia.
    const { location, ...rest } = trackingRecord;

    return {
        ...rest,
        latitude,
        longitude
    };
}

// 🔹 1. Obtener la última ubicación registrada (para el mapa)
const getLatestLocation = async (vehicleId) => {
    const latest = await tracking.findOne({
        where: { vehicleId },
        order: [['gpsTimestamp', 'DESC']], // La más reciente
        limit: 1,
        raw: true // Obtener solo los datos sin metadata de Sequelize
    });

    return formatTrackingRecord(latest);
};

// 🔹 2. Obtener historial de ubicaciones entre dos fechas (para la ruta recorrida)
const getVehicleHistory = async (vehicleId, startDate, endDate) => {
    const history = await tracking.findAll({
        where: {
            vehicleId,
            gpsTimestamp: {
                [sequelize.Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`]
            }
        },
        order: [['gpsTimestamp', 'ASC']], 
        raw: true
    });

    // Mapear y convertir los resultados de GEOMETRY a lat/lon
    return history.map(formatTrackingRecord);
};


// 🔹 3. FUNCIÓN CRUCIAL DE INSERCIÓN (Usada por el Servidor TCP/MQTT)
const createTrackingRecord = async ({ vehicleId, latitude, longitude, speed, direction, ignition, status, gpsTimestamp }) => {
    // 💡 Aquí convertimos el par lat/lon simple en el objeto GEOMETRY requerido por PostGIS.
    const newRecord = await tracking.create({
        vehicleId,
        gpsTimestamp,
        speed,
        direction,
        ignition,
        status,
        // 🚨 PostGIS espera el formato GeoJSON con [LONGITUDE, LATITUDE]
        location: {
            type: 'Point',
            coordinates: [longitude, latitude], 
            crs: { type: 'name', properties: { name: 'EPSG:4326' } }
        }
    });
    
    // Opcional: devolver el registro creado formateado.
    return formatTrackingRecord(newRecord.toJSON());
};


module.exports = {
    getLatestLocation,
    getVehicleHistory,
    createTrackingRecord
};