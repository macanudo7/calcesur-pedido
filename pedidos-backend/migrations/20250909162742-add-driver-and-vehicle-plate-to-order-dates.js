'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agrega driver_name y vehicle_plate a la tabla OrderDates
    await queryInterface.addColumn('OrderDates', 'driver_name', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('OrderDates', 'vehicle_plate', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revierte la migración
    await queryInterface.removeColumn('OrderDates', 'driver_name');
    await queryInterface.removeColumn('OrderDates', 'vehicle_plate');
  }
};
