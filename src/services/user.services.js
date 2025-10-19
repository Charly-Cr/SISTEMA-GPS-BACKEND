const { user } = require('../models');

const getAllUser = async () => {
  return await user.findAll({
    attributes: { exclude: ["password"] } // Opcional, oculta la contraseña
  });
}

// Devuelve todos los usuarios sin la contraseña
const createUser = async (body) => {
  const newUser = await user.create(body);
  const userJson = newUser.toJSON();
  delete userJson.password;
  return userJson;
};

const getOneUser = async (id) => {
  return await user.findByPk(id, {
    attributes: { exclude: ["password"] } // Opcional, oculta la contraseña
  });
};

const putUser = async (body, id) => {
  return await user.update(
    body,
    { where: { id }, returning: true }
  );
}

const removeUser = async (userId) => {
  return await user.destroy({ where: { id : userId} });
}

const loginEmailUser = async (email) => {
  return await user.findOne({ where: { email } })
}

module.exports = {
  getAllUser,
  createUser,
  getOneUser,
  putUser,
  removeUser,
  loginEmailUser
}

