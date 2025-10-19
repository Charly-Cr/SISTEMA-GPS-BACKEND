const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  // Acceder al token desde las cookies (en lugar del header Authorization)
  const token = req.cookies.token; // Asumiendo que la cookie se llama "token"

  if (!token) {
    return res.sendStatus(401); // Si no hay token, devolver 401
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expirado, por favor inicia sesión nuevamente' });
        }
        return res.status(403).json({ error: 'Token inválido' });
      }

      // Extraer solo los campos necesarios del token
      const { id, role } = decoded;
      req.user = { id, role };

      // req.user = {
      //   ...decoded.user, // Guardar el usuario decodificado
      //   iat: new Date(decoded.iat * 1000).toLocaleString(),
      // exp: new Date(decoded.exp * 1000).toLocaleString()
      // }
      next(); // Pasar al siguiente middleware o ruta
    }
  );
};

module.exports = { verifyJWT };



