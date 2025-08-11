'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderChangeRequests', {
      request_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_date_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OrderDates',
          key: 'order_date_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Si se elimina un registro de OrderDates, se eliminan sus solicitudes de cambio
      },
      request_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      change_quantity: {
        type: Sequelize.INTEGER
      },
      requested_at: {
        type: Sequelize.DATE
      },
      admin_response_at: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderChangeRequests');
  }
};