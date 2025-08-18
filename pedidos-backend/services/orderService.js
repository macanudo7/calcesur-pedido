const { Order, User, Product, OrderDates, sequelize} = require('../models');

const orderService = {

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
                    where: { user_id: orderData.user_id },
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
                    const hasSameMonth = existingOrder.orderDates.some(od => {
                        const d = new Date(od.delivery_date);
                        return d.getFullYear() === year && (d.getMonth() + 1) === month;
                    });
                    if (hasSameMonth) {
                        throw new Error('Ya existe un pedido para este usuario en el mismo mes.');
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