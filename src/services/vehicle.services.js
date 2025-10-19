const { vehicle } = require('../models');

// 🔹 Obtener todos los vehículos
const getAllVehicles = async () => {
  return await vehicle.findAll();
};

// 🔹 Obtener vehículos de un usuario específico
const getUserVehicles = async (userId) => {
  return await vehicle.findAll({
    where: { userId }
  });
};

// 🔹 Crear vehículo
const createVehicle = async (data) => {
  const newVehicle = await vehicle.create(data);
  return newVehicle.toJSON();
};

// 🔹 Obtener un vehículo por ID
const getOneVehicle = async (id) => {
  return await vehicle.findByPk(id);
};

// 🔹 Actualizar vehículo
const updateVehicle = async (data, id) => {
  return await vehicle.update(data, { where: { id }, returning: true });
};

// 🔹 Eliminar vehículo
const removeVehicle = async (id) => {
  return await vehicle.destroy({ where: { id } });
};

module.exports = {
  getAllVehicles,
  getUserVehicles,
  createVehicle,
  getOneVehicle,
  updateVehicle,
  removeVehicle
};
