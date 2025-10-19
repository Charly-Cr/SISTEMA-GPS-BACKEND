const jwt = require('jsonwebtoken')

const sessionJWT = (req, res, next) => {

  const user = req.userlogged

  // Duración para el JWT (ej. 30 días)
  const JWT_EXPIRATION = '30d';

  // Duración para la cookie en milisegundos (ej. 30 días)
  // 30 días * 24 horas/día * 60 minutos/hora * 60 segundos/minuto * 1000 milisegundos/segundo
  const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // = 2592000000 milisegundos

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.TOKEN_SECRET,
    { expiresIn: JWT_EXPIRATION }  // El token expira en 30 días
);
// Enviar token en una cookie HTTP-only
res.cookie("token", token, {
    httpOnly: true,  // Evita acceso desde JavaScript
    secure: process.env.NODE_ENV === "production",   // Solo en HTTPS si está en producción
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",   // Controla el envío entre sitios
    path: "/", // Hace que la cookie sea accesible en toda la app
    maxAge: COOKIE_MAX_AGE, // La cookie expira en 30 días
});
next();
};
module.exports = sessionJWT
