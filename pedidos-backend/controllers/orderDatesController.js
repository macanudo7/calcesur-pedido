// src/controllers/orderDatesController.js

const orderDatesService = require('../services/orderDatesService');

const orderDatesController = {
  async create(req, res) {
    try {
      const newOrderDate = await orderDatesService.createOrderDate(req.body);
      res.status(201).json(newOrderDate);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async findAll(req, res) {
    try {
      const orderDates = await orderDatesService.getAllOrderDates();
      res.status(200).json(orderDates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async findOne(req, res) {
    try {
      const orderDate = await orderDatesService.getOrderDateById(req.params.id);
      if (orderDate) {
        res.status(200).json(orderDate);
      } else {
        res.status(404).json({ error: 'Detalle de pedido no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const updatedOrderDate = await orderDatesService.updateOrderDate(req.params.id, req.body);
      if (updatedOrderDate) {
        res.status(200).json(updatedOrderDate);
      } else {
        res.status(404).json({ error: 'Detalle de pedido no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await orderDatesService.deleteOrderDate(req.params.id);
      if (deleted) {
        res.status(204).send(); // 204 No Content
      } else {
        res.status(404).json({ error: 'Detalle de pedido no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = orderDatesController;