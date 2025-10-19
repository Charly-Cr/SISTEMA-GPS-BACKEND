const catchError = require('../utils/catchError');
const {
  getAllVehicles,
  createVehicle,
  getOneVehicle,
  updateVehicle,
  deleteVehicle,
  getUserVehicles
} = require('../services/vehicle.services');

// 🔹 Obtener todos los vehículos (solo admin o superadmin)
const getAll = catchError(async (req, res) => {
  const results = await getAllVehicles();
  return res.json(results);
});

// 🔹 Crear vehículo (solo admin o superadmin)
const create = catchError(async (req, res) => {
  const result = await createVehicle(req.body);
  return res.status(201).json(result);
});

// 🔹 Obtener vehículo por ID (usa verifyAccessVehicle)
const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await getOneVehicle(id);
  if (!result) return res.status(404).json({ message: 'Vehículo no encontrado' });
  return res.json(result);
});

// 🔹 Actualizar vehículo (usa verifyAccessVehicle)
const update = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await updateVehicle(req.body, id);
  if (!result[0]) return res.status(404).json({ message: 'Vehículo no encontrado' });
  return res.json(result[1][0]);
});

// 🔹 Eliminar vehículo (usa verifyAccessVehicle)
const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await deleteVehicle(id);
  if (!result) return res.status(404).json({ message: 'Vehículo no encontrado' });
  return res.sendStatus(204);
});

// 🔹 Obtener vehículos del usuario autenticado
const getMyVehicles = catchError(async (req, res) => {
  const results = await getUserVehicles(req.user.id);
  return res.json(results);
});

module.exports = {
  getAll,
  create,
  getOne,
  update,
  remove,
  getMyVehicles,
};
