// pedidos-backend/routes/typeVehicles.js
const express = require('express');
const router = express.Router();
const typeVehicleController = require('../controllers/typeVehicleController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Rutas protegidas solo para admin
router.post('/', protect, restrictTo('admin'), typeVehicleController.createTypeVehicle); // Crear un nuevo tipo de vehículo
router.put('/:id', protect, restrictTo('admin'), typeVehicleController.updateTypeVehicle); // Actualizar un tipo de vehículo por ID
router.delete('/:id', protect, restrictTo('admin'), typeVehicleController.deleteTypeVehicle); // Eliminar un tipo de vehículo por ID

// Rutas públicas o protegidas según necesidad
router.get('/', typeVehicleController.getAllTypeVehicles);  // Obtener todos los tipos de vehículo
router.get('/:id', typeVehicleController.getTypeVehicleById); // Obtener un tipo de vehículo por ID

module.exports = router;