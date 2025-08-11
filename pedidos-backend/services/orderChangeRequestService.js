const { OrderChangeRequests, OrderDates, sequelize } = require('../models');


const OrderChangeRequestsService = {

    /**
   * Crea una nueva solicitud de cambio para un pedido.
   * @param {object} requestData - Datos de la solicitud de cambio.
   */ 

    async createChangeRequest(requestData) {
        try {
            const newRequest = await OrderChangeRequests.create(requestData);
            return newRequest;
        } catch (error) {
            console.error('Error al crear la solicitud de cambio:', error);
            throw new Error('Error al crear la solicitud de cambio: ' + error.message);
        }
    },

     /**
   * Obtiene todas las solicitudes de cambio, opcionalmente por estado.
   * @param {string} status - El estado de la solicitud (e.g., 'pending', 'approved').
   */
    async getAllChangeRequests(status = 'all') {
        try {
            let whereClause = {};
            if (status !== 'all') {
                whereClause.status = status;
            }
            return await OrderChangeRequests.findAll({
                where: whereClause,
                include: [{ model: OrderDates, as: 'orderDate' }],
                order: [['requested_at', 'DESC']]
            });
        } catch (error) {
            console.error('Error al obtener las solicitudes de cambio:', error);
            throw new Error('Error al obtener las solicitudes de cambio: ' + error.message);
        }
    },

    /**
   * Actualiza el estado de una solicitud de cambio.
   * @param {number} requestId - ID de la solicitud de cambio.
   * @param {object} responseData - Datos de la respuesta (e.g., 'status', 'admin_response_at').
   */
    async updateChangeRequest(requestId, responseData) {
        try {
            const request = await OrderChangeRequests.findByPk(requestId);
            if (!request) {
                throw new Error('Solicitud de cambio no encontrada');
            }
            await request.update(responseData, { transtaaction})
            await transtaaction.commit();
            return request;
        } catch (error) {
            await transtaaction.rollback();
            console.error('Error al actualizar la solicitud de cambio:', error);
            throw new Error('Error al actualizar la solicitud de cambio: ' + error.message);
        }
    },

    


}

module.exports = OrderChangeRequestsService;