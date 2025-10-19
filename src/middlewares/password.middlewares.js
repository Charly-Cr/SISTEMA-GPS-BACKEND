const bcrypt = require('bcrypt');

const passwordMiddlewares = async (req, res, next) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: "La contraseña es requerida" });

  const passwordHash = await bcrypt.hash(password, 10);
  req.passwordHash = passwordHash;
  next();
};

module.exports = { 
  passwordMiddlewares 
};
