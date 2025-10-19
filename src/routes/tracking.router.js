const express = require('express');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles'); 
const { getLatest, getHistory } = require('../controllers/tracking.controllers');
const verifyAccessVehicle = require('../utils/verifyAccessVehicle'); 


const trackingRouter = express.Router();

// 🔹 TODAS las rutas de rastreo requieren autenticación
trackingRouter.use(verifyJWT); 


// 🟢 RUTAS DE CONSULTA
// GET /api/v1/tracking/latest/:vehicleId
// Permite al usuario ver la posición actual de SU vehículo.
trackingRouter.route('/latest/:vehicleId')
    .get(verifyRoles('user', 'admin', 'superadmin'), verifyAccessVehicle, getLatest );

// GET /api/v1/tracking/history/:vehicleId?start=...&end=...
// Permite al usuario ver el historial de rutas de SU vehículo.
trackingRouter.route('/history/:vehicleId')
    .get( verifyRoles('user', 'admin', 'superadmin'), verifyAccessVehicle, getHistory );


module.exports = trackingRouter;