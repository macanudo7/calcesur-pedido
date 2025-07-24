'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      product_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false // Asumo que el nombre del producto no puede ser nulo
      },
      code: {
        type: Sequelize.INTEGER,
        allowNull: false, // Asumo que el código del producto no puede ser nulo
        unique: true // El código del producto debería ser único
      },
      type_vehicle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Definición de la clave foránea
          model: 'TypeVehicles', // Nombre de la tabla a la que hace referencia (en plural)
          key: 'type_vehicle_id' // Nombre de la columna en la tabla TypeVehicles
        },
        onUpdate: 'CASCADE', // Opcional: Qué hacer si el type_vehicle_id en TypeVehicles cambia
        onDelete: 'RESTRICT' // Opcional: Qué hacer si un TypeVehicle es eliminado. Considera 'RESTRICT' o 'CASCADE' según tu lógica.
                            // 'SET NULL' requiere que la columna type_vehicle_id sea NULLABLE, pero la definiste como NOT NULL.
                            // Si es NOT NULL, usa 'RESTRICT' o 'CASCADE'. 'RESTRICT' es más seguro.
      },
      type_unit: {
        type: Sequelize.STRING,
        allowNull: true // Asumo que la unidad de medida puede ser nula inicialmente
      },
      // Campos de timestamp (es buena práctica incluirlos)
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
    await queryInterface.dropTable('Products');
  }
};