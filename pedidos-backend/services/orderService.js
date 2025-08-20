const { Order, User, Product, OrderDates, sequelize} = require('../models');
const { Op } = require('sequelize'); // Usaremos Op para búsquedas avanzadas si es necesario

const orderService = {

    async getOrdersByUserAndMonth(userId, year, month, day) {
        try {

            const startDate = new Date(year, month - 1, 1); // Primer día del mes
            const endDate = new Date(year, month, 0); // Último día del mes
            const currentDate = new Date(year, month - 1, day); // Fecha límite para el cálculo

            
            const orders = await Order.findAll({
                where: { user_id: userId },
                include: [
                {
                    model: OrderDates,
                    as: 'orderDates',
                    where: {
                        delivery_date: {
                            [Op.between]: [startDate, endDate]
                        }
                    }
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['name', 'code']
                }
                ]
            });

            const results = orders.map(order => {
        const totalOrderDates = order.orderDates.length;

        // Filtrar los OrderDates hasta la fecha actual
        const orderDatesUntilNow = order.orderDates.filter(od =>
          new Date(od.delivery_date) <= currentDate
        );

        const deliveredOrderDates = orderDatesUntilNow.filter(
          od => od.status === 'delivered'
        );

        // Calcular porcentajes
        const cumplimiento = orderDatesUntilNow.length > 0 
          ? (deliveredOrderDates.length / orderDatesUntilNow.length) * 100
          : 0;

        const avanceCronograma = totalOrderDates > 0
          ? (orderDatesUntilNow.length / totalOrderDates) * 100
          : 0;

        return {
          order_id: order.order_id,
          user_id: order.user_id,
          product: order.product,
          status: order.status,
          cumplimiento: cumplimiento.toFixed(2), // Porcentaje con 2 decimales
          avanceCronograma: avanceCronograma.toFixed(2), // Porcentaje con 2 decimales
          orderDates: order.orderDates
        };
      });

      return results;

        } catch (error) {
            console.error('Error al obtener pedidos por usuario y mes:', error);
            throw new Error('No se pudieron obtener los pedidos.');
        }
    },

    async createOrderwithDates(orderData, orderDatesData){
        const t = await sequelize.transaction();
        try {
            // 1. Validar si el usuario ya tiene un pedido para ese mes
            if (orderDatesData && orderDatesData.length > 0) {
                // Tomamos el primer orderDate como referencia
                const deliveryDate = new Date(orderDatesData[0].delivery_date);
                const year = deliveryDate.getFullYear();
                const month = deliveryDate.getMonth() + 1; // getMonth() es base 0

                // Buscar si ya existe un pedido del usuario para ese mes y año
                const existingOrder = await Order.findOne({
                    where: {
                        user_id: orderData.user_id,
                        product_id: orderData.product_id // Validar también el producto
                    },
                    include: [{
                        model: OrderDates,
                        as: 'orderDates',
                        where: sequelize.where(
                            sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "delivery_date"')), year
                        ),
                        required: true
                    }]
                });

                if (existingOrder) {
                // Verificar si alguna fecha de ese pedido coincide en mes y año
                const hasSameMonthAndProduct = existingOrder.orderDates.some(od => {
                    const d = new Date(od.delivery_date);
                    return d.getFullYear() === year && (d.getMonth() + 1) === month;
                });
                if (hasSameMonthAndProduct) {
                    throw new Error('Ya existe un pedido para este usuario con el mismo producto en el mismo mes.');
                }
            }
            }

            //1. Crear el pedido
            const newOrder = await Order.create(orderData, { transaction: t});
            //2. Asociar cada orderDates con el nuevo pedido y crearlos
            if(orderDatesData && orderDatesData.length >0){
                const orderDatesToCreate = orderDatesData.map(date => ({
                    ...date,
                    order_id: newOrder.order_id
                }));
                await OrderDates.bulkCreate(orderDatesToCreate, { transaction: t});
            }
            // 3. Confirmar la transaccion
            await t.commit();
            return newOrder;

        } catch (error) {
            await t.rollback();
            throw new Error('Error al crear el pedido y sus fechas:' + error.message);
        }

    },
    // Crear un nuevo pedido
    async createOrder(data){
        try{
            const newOrder = await Order.create(data);
            return newOrder;
        } catch (error){
            throw new Error('Error al crear el pedido: '+ error.message);
        }
    },
    // Obtener todos los pedidos
    async getAllOrders(){
        try {
            const orders = await Order.findAll({
                include: [
                    { model: User, as: 'user'},
                    { model: Product, as: 'product'},
                    { model: OrderDates, as: 'orderDates'}
                ]
            });
            return orders
        } catch (error) {
            throw new Error('Error al obtener los pedidos: '+ error.message);            
        }
    },
    // Obtener un pedido por ID
    async getOrderById(id) {
        try {
            const order = await Order.findByPk(id,{
              include: [
                    { model: User, as: 'user'},
                    { model: Product, as: 'product'},
                    { model: OrderDates, as: 'orderDates'}
                ]  
            })
            return order;
        } catch (error) {
            throw new Error('Error al obtener el pedido: '+ error.message);                      
        }

    },
    // Actualizar un pedido
    async updateOrder(id, data){
        try {
            const [updated] = await Order.update( data, {
                where: {order_id: id}
            });
            if(updated){
                const updatedOrder = await this.getOrderById(id);
                return updatedOrder;
            }
            return null;
            
        } catch (error) {
           throw new Error('Error al actualizar el pedido: ' + error.message);       
        }

    },
    //Eliminar un pedido
    async deleteOrder(id){
        try {
            const deleted = await Order.destroy({
                where: {order_id: id}
            });
            return deleted;
        } catch (error) {
            throw new Error('Error al eliminar el pedido: ' + error.message);            
        }
    }
};
module.exports = orderService;