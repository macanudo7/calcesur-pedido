require('dotenv').config(); // Asegúrate de que dotenv esté cargado al inicio

module.exports = {
  // ... otras configuraciones de DB si las tienes aquí
  jwtSecret: process.env.JWT_SECRET || 'fallbackSecretForDev',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};