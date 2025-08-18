const orderService = require('../services/orderService');

const orderController = {
    async create(req, res) {
        try {
            const { orderDates, ...orderData } = req.body;
        
            const newOrder = await orderService.createOrderwithDates(orderData, orderDates);
            res.status(201).json(newOrder);
        } catch (error) {
            res.status(400).json({ error: error.message});
        }
    },
    async findAll(req,res){
        try {
            const orders = await orderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },
    async findOne(req, res){
        try {
            const order = await orderService.getOrderById(req.params.id);
            if (order){
                res.status(200).json(order);
            } else {
                res.status(404).json({ error: 'Pedido no encontrado'});
            }
        } catch (error) {
            res.status(500).json({ error: error.message});
        }
    },
    async update(req,res){
        try {
            const updatedOrder = await orderService.updateOrder(req.params.id, req.body)
            if (updatedOrder) {
                res.status(200).json(updatedOrder);
            } else {
                res.status(404).json({ error: 'Pedido no encontrado'});
            }
        } catch (error) {
            res.status(500).json({ error: error.message});
        }
    },
    async delete(req, res) {
        try {
            const deleted = await orderService.deleteOrder(req.params.id);
            if(deleted){
                res.status(204).send();
            }else {
                res.status(404).json({ error: 'Pedido no encontrado'});
            }

        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
};
module.exports = orderController;