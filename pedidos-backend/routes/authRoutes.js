const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para el registro de usuarios (si el auto-registro está permitido)
// O esta ruta podría ser solo accesible por administradores más adelante

// Ruta para el login de usuarios (clientes y administradores)
router.post('/login', authController.login);

// Ruta para la solicitud de recuperación de contraseña
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;