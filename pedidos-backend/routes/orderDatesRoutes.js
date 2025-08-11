const express = require('express');
const router = express.Router();
const orderDatesController = require('../controllers/orderDatesController');

router.post('/', orderDatesController.create);
router.get('/', orderDatesController.findAll);
router.get('/:id', orderDatesController.findOne);
router.put('/:id', orderDatesController.update);
router.delete('/:id', orderDatesController.delete);

module.exports = router;