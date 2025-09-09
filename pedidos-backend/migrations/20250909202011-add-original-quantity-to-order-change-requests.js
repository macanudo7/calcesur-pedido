'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('OrderChangeRequests', 'original_quantity', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: 'Cantidad original registrada antes del cambio'
    });
  },

  async down(queryInterface, Sequelize) {
    // Comprobar existencia de la columna antes de intentar eliminarla
    const tableDefinition = await queryInterface.describeTable('OrderChangeRequests');
    if (tableDefinition && tableDefinition.original_quantity) {
      await queryInterface.removeColumn('OrderChangeRequests', 'original_quantity');
    } else {
      // Si no existe, no hacer nada (evitar error al revertir)
      return Promise.resolve();
    }
  }
};