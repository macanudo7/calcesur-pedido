const express = require('express');
const router = express.Router();
const OrderChangeRequestController = require('../controllers/orderChangeRequestController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');  

// Rutas para los clientes (puedes crear solicitudes de cambio de pedido)
router.post('/', protect, OrderChangeRequestController.createChangeRequest); // Crear una solicitud de cambio  

//Rutas pora los administradores (pueden ver y responder solicitudes de cambio)
router.get('/', protect, restrictTo('admin'), OrderChangeRequestController.getAllChangeRequests); 
router.put('/:id', protect, restrictTo('admin'), OrderChangeRequestController.respondToChangeRequest); // Responder a una solicitud de cambio

module.exports = router;