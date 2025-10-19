const { vehicle } = require('../models');

// Middleware universal para verificar el acceso al vehículo, buscando el ID
// en 'id' o en 'vehicleId' dentro de req.params.
const verifyAccessVehicle = async (req, res, next) => {
    try {
        // 🚨 CAMBIO CLAVE: Obtener el ID del vehículo, ya sea que se llame 'id' o 'vehicleId'
        const vehicleId = req.params.id || req.params.vehicleId; 

        if (!vehicleId) {
             return res.status(400).json({ message: 'ID de vehículo no proporcionado en la ruta.' });
        }

        // 🔹 Los roles 'admin' y 'superadmin' siempre tienen acceso total.
        if (req.user.role === 'admin' || req.user.role === 'superadmin') {
            return next();
        }
        
        // 🔹 Solo si el usuario es 'user', verificamos propiedad
        if (req.user.role === 'user') {
            const result = await vehicle.findByPk(vehicleId);

            if (!result) {
                return res.status(404).json({ message: 'Vehículo no encontrado' });
            }

            // 🔹 El usuario solo puede acceder a sus propios vehículos
            if (result.userId !== req.user.id) {
                return res.status(403).json({ message: 'No autorizado para acceder a este vehículo' });
            }
        }

        // Si es 'admin/superadmin' o si es 'user' y la propiedad es verificada
        next();
    } catch (error) {
        console.error('Error en verifyAccessVehicle:', error);
        return res.status(500).json({ message: 'Error interno en control de acceso' });
    }
};

module.exports = verifyAccessVehicle;