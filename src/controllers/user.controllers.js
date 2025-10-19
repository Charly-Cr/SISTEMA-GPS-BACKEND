const catchError = require('../utils/catchError');
const { getAllUser, createUser, getOneUser, putUser, removeUser } = require('../services/user.services');
const jwt = require('jsonwebtoken')

const getAll = catchError(async (req, res) => {
  const results = await getAllUser();
  return res.json(results);
});


const create = catchError(async (req, res) => {
  const result = await createUser({ ...req.body, password: req.passwordHash });
  return res.status(201).json(result);
});


const getOne = catchError(async (req, res) => {
  // Por seguridad no trabajar con req.params;
  const { id: userId } = req.user; 
  const result = await getOneUser( userId );
  if (!result) return res.sendStatus(404);
  return res.json(result);
});


const update = catchError(async (req, res) => {
  // Por seguridad no trabajar con req.params;
  const { id: userId } = req.user;
  const result = await putUser(req.body, userId);
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});


const remove = catchError(async (req, res) => {
  // Por seguridad no trabajar con req.params;
  const { id: userId } = req.user;
  const result = await removeUser(userId)
  if (!result) return res.sendStatus(404);
  return res.sendStatus(204);
});


const login = catchError(async (req, res) => {
  const user = req.userlogged;
  
  if (!user) {
    return res.status(401).json({ message: "Usuario no autorizado" });
  }

  // Eliminar el campo password del objeto antes de devolverlo
  const { password, ...userWithoutPassword } = user.toJSON();

  return res.json({ user: userWithoutPassword, message: "Login exitoso" }); 
});


const logged = catchError(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No autorizado" });
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  return res.json({ user: decoded });
});

const logout = catchError(async (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Sesión cerrada correctamente" });
});

module.exports = {
  getAll,
  create, 
  getOne,
  remove,
  update,
  login, 
  logged,
  logout
}