// pedidos-backend/routes/typeVehicles.js
const express = require('express');
const router = express.Router();
const typeVehicleController = require('../controllers/typeVehicleController');
// Si necesitas autenticación o autorización, importar aquí tus middlewares
// const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para TypeVehicles
router.post('/', typeVehicleController.createTypeVehicle); // Crear un nuevo tipo de vehículo
router.get('/', typeVehicleController.getAllTypeVehicles);  // Obtener todos los tipos de vehículo
router.get('/:id', typeVehicleController.getTypeVehicleById); // Obtener un tipo de vehículo por ID
router.put('/:id', typeVehicleController.updateTypeVehicle); // Actualizar un tipo de vehículo por ID
router.delete('/:id', typeVehicleController.deleteTypeVehicle); // Eliminar un tipo de vehículo por ID

module.exports = router;