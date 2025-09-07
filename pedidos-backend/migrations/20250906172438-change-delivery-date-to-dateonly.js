'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // crear columna temporal DATEONLY
    await queryInterface.addColumn('OrderDates', 'delivery_date_tmp', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    // copiar valores convirtiendo timestamptz -> date (sin texto)
    await queryInterface.sequelize.query(`
      UPDATE "OrderDates"
      SET "delivery_date_tmp" = (("delivery_date"::timestamptz AT TIME ZONE 'UTC')::date)
    `);

    await queryInterface.removeColumn('OrderDates', 'delivery_date');
    await queryInterface.renameColumn('OrderDates', 'delivery_date_tmp', 'delivery_date');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('OrderDates', 'delivery_date_tmp', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.sequelize.query(`
      UPDATE "OrderDates"
      SET "delivery_date_tmp" = (("delivery_date"::date)::timestamp)
    `);

    await queryInterface.removeColumn('OrderDates', 'delivery_date');
    await queryInterface.renameColumn('OrderDates', 'delivery_date_tmp', 'delivery_date');
  }
};
