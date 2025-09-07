const OrderChangeRequestsService = require('../services/orderChangeRequestService');

const OrderChangeRequestsController = {
    async createChangeRequest(req, res) {
        try {
            const newRequest  =  await OrderChangeRequestsService.createChangeRequest(req.body);
            res.status(201).json({
                message: 'Solicitud de cambio creada exitosamente',
                data: newRequest    
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async getAllChangeRequests(req, res) {
        try {
            const status = req.query.status || 'all';
            const requests = await OrderChangeRequestsService.getAllChangeRequests(status);
            res.status(200).json(requests);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getChangeRequestById(req, res) {
        try {
            const { id } = req.params;
            const request = await OrderChangeRequestsService.getChangeRequestById(id);
            if (!request) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }
            res.status(200).json(request);
        } catch (error) {
            console.error('Error getChangeRequestById:', error);
            res.status(500).json({ error: error.message });
        }
    },
    
    async respondToChangeRequest(req, res) {
        const { id } = req.params;
        const responseData = req.body;

        try {
            const updatedRequest = await OrderChangeRequestsService.updateChangeRequest(id, responseData);
            res.status(200).json({
                message: 'Solicitud de cambio actualizada exitosamente',
                data: updatedRequest
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getChangeRequestsByOrderDate(req, res) {
        try {
            const { orderDateId } = req.params;
            if (!orderDateId) {
                return res.status(400).json({ message: 'orderDateId es requerido.' });
            }
            const list = await OrderChangeRequestsService.getChangeRequestsByOrderDate(orderDateId);
            return res.status(200).json(list);
        } catch (error) {
            console.error('Error getChangeRequestsByOrderDate:', error);
            return res.status(500).json({ error: error.message || 'Error al obtener las solicitudes.' });
        }
    },

    async queryChangeRequests(req, res) {
        try {
            const { order_date_ids, limit_per_order_date } = req.body;
            if (!Array.isArray(order_date_ids)) {
                return res.status(400).json({ message: 'order_date_ids debe ser un arreglo de IDs.' });
            }
            const limit = limit_per_order_date != null ? Number(limit_per_order_date) : 1;
            const byOrderDate = await OrderChangeRequestsService.queryChangeRequests(order_date_ids, limit);
            return res.status(200).json({ byOrderDate });
        } catch (error) {
            console.error('Error queryChangeRequests controller:', error);
            return res.status(500).json({ error: error.message || 'Error al consultar change requests.' });
        }
    },

    
}

module.exports = OrderChangeRequestsController;