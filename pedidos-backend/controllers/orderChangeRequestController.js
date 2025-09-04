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
    }
}

module.exports = OrderChangeRequestsController;