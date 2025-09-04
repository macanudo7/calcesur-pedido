const { OrderChangeRequests, OrderDates, sequelize } = require('../models');


const OrderChangeRequestsService = {

    /**
   * Crea una nueva solicitud de cambio para un pedido.
   * @param {object} requestData - Datos de la solicitud de cambio.
   */ 

    async createChangeRequest(requestData) {
        const od = await OrderDates.findByPk(requestData.order_date_id);
        if (!od) {
            throw new Error('Fecha de pedido no encontrada');
        }

        // opcional: prevenir duplicados (mismo tipo + pedido abierto)
        // const exists = await OrderChangeRequests.findOne({ where: { order_date_id: requestData.order_date_id, request_type: requestData.request_type, status: 'pending' } });
        // if (exists) throw new Error('Ya existe una solicitud pendiente para este order date y tipo');

        const newRequest = await OrderChangeRequests.create({
            ...requestData,
            requested_at: requestData.requested_at || new Date(),
            status: 'pending'
        });
        return newRequest;
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

    async getChangeRequestById(id) {
        try {
        const request = await OrderChangeRequests.findByPk(id, {
            include: [
            { model: OrderDates, as: 'orderDate' } // ajusta alias si tu asociación es distinta
            ]
        });
        return request;
        } catch (error) {
        console.error('Error al obtener la solicitud por id:', error);
        throw new Error('Error al obtener la solicitud: ' + (error.message || String(error)));
        }
    },

    /**
   * Actualiza el estado de una solicitud de cambio.
   * @param {number} requestId - ID de la solicitud de cambio.
   * @param {object} responseData - Datos de la respuesta (e.g., 'status', 'admin_response_at').
   */
    async updateChangeRequest(requestId, responseData) {
        // Inicia correctamente una transacción y usa transacción en update
        const t = await sequelize.transaction();
        try {
            const request = await OrderChangeRequests.findByPk(requestId, { transaction: t });
            if (!request) {
                await t.rollback();
                throw new Error('Solicitud de cambio no encontrada');
            }
            await request.update(responseData, { transaction: t });
            await t.commit();
            return request;
        } catch (error) {
            await t.rollback();
            console.error('Error al actualizar la solicitud de cambio:', error);
            throw new Error('Error al actualizar la solicitud de cambio: ' + error.message);
        }
    },

    


}

module.exports = OrderChangeRequestsService;