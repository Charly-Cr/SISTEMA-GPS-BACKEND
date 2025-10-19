const express = require('express');
const { verifyJWT } = require('../utils/verifyJWT');
const verifyRoles = require('../utils/verifyRoles');
const verifyAccessVehicle = require('../utils/verifyAccessVehicle');
const { getAll, create, getOne, update, remove, getMyVehicles } = require('../controllers/vehicle.controllers');

const vehicleRouter = express.Router();

// 🔹 Todas las rutas protegidas por JWT
vehicleRouter.use(verifyJWT);

// 🔹 Solo superadmin/admin pueden ver o crear vehículos
vehicleRouter.route('/')
  .get(verifyRoles('superadmin', 'admin'), getAll)
  .post(verifyRoles('superadmin', 'admin'), create);

// 🔹 Usuario autenticado (o admin/superadmin) puede ver sus vehículos
vehicleRouter.route('/my')
  .get(verifyRoles('superadmin', 'admin', 'user'), getMyVehicles);

// 🔹 Rutas con ID: acceso controlado
vehicleRouter.route('/:id')
  .get(verifyRoles('superadmin', 'admin', 'user'), verifyAccessVehicle, getOne)
  .put(verifyRoles('superadmin', 'admin'), verifyAccessVehicle, update)
  .delete(verifyRoles('superadmin', 'admin'), verifyAccessVehicle, remove);

module.exports = vehicleRouter;
