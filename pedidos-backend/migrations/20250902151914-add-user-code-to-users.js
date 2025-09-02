'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Agrega la nueva columna user_code a la tabla Users
    await queryInterface.addColumn('Users', 'user_code', {
      type: Sequelize.STRING(10), // Define el tipo de dato como STRING con longitud de 10
      allowNull: true, // Puedes cambiar esto a false si el campo es obligatorio
    });
  },

  async down(queryInterface, Sequelize) {
    // Revierte la migración eliminando la columna
    await queryInterface.removeColumn('Users', 'user_code');
  }
};
