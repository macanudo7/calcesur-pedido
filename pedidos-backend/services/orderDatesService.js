const {OrderDates, Order} = require('../models')

const orderDatesService = {
    async createOrderDate(data) {
        try {
            const newOrderDate = await OrderDates.create(data);
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