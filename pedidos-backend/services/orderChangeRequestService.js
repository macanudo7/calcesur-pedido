const { OrderChangeRequests, OrderDates, sequelize } = require('../models');
const { Op } = require('sequelize');

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

    async getChangeRequestsByOrderDate(orderDateId) {
        try {
            const requests = await OrderChangeRequests.findAll({
                where: { order_date_id: orderDateId },
                order: [['requested_at', 'DESC']]
            });

            // Mapear a la estructura de respuesta esperada
            return requests.map(r => ({
                change_request_id: r.request_id || r.change_request_id || null,
                order_date_id: r.order_date_id,
                request_type: r.request_type,
                change_quantity: r.change_quantity,
                admin_notes: r.admin_notes || null,
                status: r.status || null,
                requested_by: r.requested_by || r.user_id || null,
                requested_at: r.requested_at || r.createdAt || null,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt
            }));
        } catch (error) {
            console.error('Error getChangeRequestsByOrderDate:', error);
            throw new Error('Error al obtener las solicitudes de cambio: ' + (error.message || String(error)));
        }
    },

    /**
   * Consulta batch de Change Requests por varios order_date_id.
   * Devuelve un objeto { orderDateId: [cr,...], ... } respetando limite por order_date.
   * @param {Array<number>} orderDateIds
   * @param {number} limitPerOrderDate
   */
  async queryChangeRequests(orderDateIds = [], limitPerOrderDate = 1) {
    try {
      if (!Array.isArray(orderDateIds) || orderDateIds.length === 0) {
        return {};
      }
      const limit = Number(limitPerOrderDate) > 0 ? Number(limitPerOrderDate) : 1;

      const requests = await OrderChangeRequests.findAll({
        where: { order_date_id: { [Op.in]: orderDateIds } },
        order: [['requested_at', 'DESC'], ['request_id', 'DESC']]
      });

      const byOrderDate = {};
      // initialize keys to ensure response contains all requested ids (even empty arrays)
      for (const id of orderDateIds) byOrderDate[String(id)] = [];

      for (const r of requests) {
        const key = String(r.order_date_id);
        if (!byOrderDate[key]) byOrderDate[key] = [];
        if (byOrderDate[key].length < limit) {
          byOrderDate[key].push(r.toJSON());
        }
      }

      return byOrderDate;
    } catch (error) {
      console.error('Error queryChangeRequests:', error);
      throw new Error('Error al consultar las solicitudes de cambio: ' + (error.message || String(error)));
    }
  },

    

    


}

module.exports = OrderChangeRequestsService;