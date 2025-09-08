const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.post('/', orderController.create);
router.get('/', protect, restrictTo('admin'), orderController.findAll);
router.get('/by-user-and-month', protect, orderController.getOrdersByUserAndMonth);
// NUEVA RUTA: pedidos que contienen change requests pendientes (solo admin)
router.get('/with-pending-change-requests', protect, restrictTo('admin'), orderController.getOrdersWithPendingChangeRequests);
router.get('/:id',protect, orderController.findOne);
router.put('/:id', protect, orderController.updateOrder);
router.put('/:id',protect, restrictTo('admin'), orderController.update);
router.delete('/:id', protect, restrictTo('admin'), orderController.delete);

module.exports = router;