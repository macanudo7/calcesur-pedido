const express = require('express');
const router = express.Router();
const orderDatesController = require('../controllers/orderDatesController');
const OrderChangeRequestsController = require('../controllers/orderChangeRequestController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post('/', orderDatesController.create);
router.get('/', orderDatesController.findAll);
router.get('/:id', orderDatesController.findOne);
router.put('/:id', orderDatesController.update);
router.delete('/:id', orderDatesController.delete);

// Listar change-requests de un orderDate (autenticado)
router.get('/:orderDateId/change-requests', OrderChangeRequestsController.getChangeRequestsByOrderDate);

module.exports = router;