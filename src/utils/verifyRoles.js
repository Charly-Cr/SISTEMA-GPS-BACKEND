const roleHierarchy = {
  superadmin: ['admin', 'user'],
  admin: ['user'],
  user: []
};

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;
      if (!userRole) return res.status(403).json({ message: 'No autorizado' });

      // Combina el rol propio con los heredados
      const inheritedRoles = roleHierarchy[userRole] || [];
      const allRoles = [userRole, ...inheritedRoles];

      // Verifica si el rol o sus herencias están permitidos
      const isAllowed = allowedRoles.some(role => allRoles.includes(role));
      if (!isAllowed)
        return res.status(403).json({ message: 'No tienes permiso suficiente' });

      next();
    } catch (err) {
      console.error('Error en verifyRoles:', err);
      res.status(500).json({ message: 'Error interno de autorización' });
    }
  };
};

module.exports = verifyRoles;
