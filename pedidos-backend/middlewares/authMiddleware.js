const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
  let token;
  // 1) Obtener el token del header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado. Por favor, inicie sesión.' });
  }

  try {
    // 2) Verificar el token
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // 3) Buscar el usuario y adjuntarlo a la petición
    const currentUser = await User.findByPk(decoded.user_id);
    if (!currentUser) {
      return res.status(401).json({ message: 'El usuario del token ya no existe.' });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // El rol del usuario se encuentra en req.user que fue adjuntado por el middleware 'protect'
    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ message: 'No tiene permiso para realizar esta acción.' });
    }
    next();
  };
};