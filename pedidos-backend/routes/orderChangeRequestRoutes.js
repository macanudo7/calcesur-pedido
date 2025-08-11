const express = require('express');
const router = express.Router();
const OrderChangeRequestsController = require('../controllers/orderChangeRequestsController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');  

// Rutas para los clientes (puedes crear solicitudes de cambio de pedido)
router.post('/', protect, OrderChangeRequestsController.createChangeRequest); // Crear una solicitud de cambio  

//Rutas pora los administradores (pueden ver y responder solicitudes de cambio)
router.get('/', protect, restrictTo('admin'), OrderChangeRequestsController.getAllChangeRequests); 
router.put('/:id', protect, restrictTo('admin'), OrderChangeRequestsController.respondToChangeRequest); // Responder a una solicitud de cambio

module.exports = router;