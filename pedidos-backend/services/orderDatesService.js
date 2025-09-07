const {OrderDates, Order} = require('../models')
const { Op } = require('sequelize');

const orderDatesService = {
    async createOrderDate(data) {
        try {
            // validar order_id y delivery_date
            if (!data || !data.order_id) {
                throw new Error('order_id es requerido para crear un OrderDate.');
            }
            if (!data.delivery_date) {
                throw new Error('delivery_date es requerido para crear un OrderDate.');
            }

            // normalizar fecha a YYYY-MM-DD (evita problemas de zona horaria)
            const date = new Date(data.delivery_date);
            if (isNaN(date.getTime())) {
                throw new Error('delivery_date inválida.');
            }
            const dateStr = date.toISOString().slice(0,10); // 'YYYY-MM-DD'
            // usar dateStr para búsqueda y creación
            const existing = await OrderDates.findOne({
                where: {
                    order_id: data.order_id,
                    delivery_date: dateStr
                }
            });

            if (existing) {
                throw new Error('Ya existe un OrderDate para ese pedido en la misma fecha.');
            }

            // asignar dateStr al payload para que se guarde como DATEONLY
            const payload = { ...data, delivery_date: dateStr };

            const newOrderDate = await OrderDates.create(payload);
            return newOrderDate;
        } catch (error) {
                  throw new Error('Error al crear el detalle del Pedido: ' + error.message);
        }
    },
  // Obtener todos los registros de fechas de pedido
  async getAllOrderDates() {
    try {
      const orderDates = await OrderDates.findAll({
        include: [{ model: Order, as: 'order' }]
      });
      return orderDates;
    } catch (error) {
      throw new Error('Error al obtener los detalles de pedidos: ' + error.message);
    }
  },

  // Obtener un registro de fecha de pedido por ID
  async getOrderDateById(id) {
    try {
      const orderDate = await OrderDates.findByPk(id, {
        include: [{ model: Order, as: 'order' }]
      });
      return orderDate;
    } catch (error) {
      throw new Error('Error al obtener el detalle del pedido ' + error.message);
    }
  },

  // Actualizar un registro de fecha de pedido
  async updateOrderDate(id, data) {
    try {
      // Obtener registro actual
      const existing = await OrderDates.findByPk(id);
      if (!existing) {
        throw new Error('OrderDate no encontrado.');
      }

      // Si intentan modificar delivery_date, rechazar la operación
      if (data.hasOwnProperty('delivery_date')) {
        const newDate = new Date(data.delivery_date).toISOString().slice(0,10);
        const oldDate = new Date(existing.delivery_date).toISOString().slice(0,10);
        if (newDate !== oldDate) {
          throw new Error('No está permitido modificar delivery_date de un OrderDate existente.');
        }
        // si la fecha es igual, eliminamos delivery_date del payload para evitar actualizaciones innecesarias
        delete data.delivery_date;
      }

      const [updated] = await OrderDates.update(data, {
        where: { order_date_id: id }
      });
      if (updated) {
        const updatedOrderDate = await this.getOrderDateById(id);
        return updatedOrderDate;
      }
      return null;
    } catch (error) {
      throw new Error('Error al actualizar el detalle del pedido: ' + error.message);
    }
  },

  // Eliminar un registro de fecha de pedido
  async deleteOrderDate(id) {
    try {
      const deleted = await OrderDates.destroy({
        where: { order_date_id: id }
      });
      return deleted;
    } catch (error) {
      throw new Error('Error al eliminar el detalle del pedido: ' + error.message);
    }
  }
};

module.exports = orderDatesService;