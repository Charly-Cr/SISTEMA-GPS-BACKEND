const bcrypt = require("bcrypt");
const { loginEmailUser } = require("../services/user.services");

const loginMiddlewares = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña son requeridos" });

    const user = await loginEmailUser(email);
    if (!user)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Credenciales inválidas" });

    // 🚦 Opcional: validar si el usuario está activo o verificado
    if (user.status === "inactive" || user.status === "suspended") {
      return res.status(403).json({ message: "Cuenta inactiva o suspendida" });
    }

    // if (!user.verified) {
    //   return res.status(403).json({ message: "Cuenta no verificada" });
    // }

    req.userlogged = user;
    next();
  } catch (error) {
    console.error("Error en loginMiddlewares:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = loginMiddlewares;
