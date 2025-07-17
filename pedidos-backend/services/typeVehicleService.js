const { TypeVehicle, Sequelize  } = require('../models'); // <-- Añade Sequelize aquí

const typeVehicleService  = {
  /**
   * Crea un nuevo tipo de vehiculo en la base de datos.
   * @param {object} typeVehicleData  - Datos del vehiculo a crear.
   * @returns {Promise<TypeVehicle>} Nuevo tipo de vehiculo creado.
   */
  async createTypeVehicle(typeVehicleData) {
    
    return TypeVehicle.create(typeVehicleData);
  },

  /**
   * Obtiene un tipo de vehículo por su ID.
   * @param {number} typeVehicleId - ID del tipo de vehículo.
   * @returns {Promise<TypeVehicle|null>} El tipo de vehículo o null si no se encuentra.
   */
  async getTypeVehicleById(typeVehicleId) {
    return TypeVehicle.findByPk(typeVehicleId);
  },

   /**
   * Obtiene un tipo de vehículo por su nombre o código.
   * @param {string} identifier - Nombre o código del tipo de vehículo.
   * @returns {Promise<TypeVehicle|null>} El tipo de vehículo o null si no se encuentra.
   */
  async findTypeVehicleByIdentifier(identifier) {
    return TypeVehicle.findOne({
      where: {
        [Sequelize.Op.or]: [
          { name: identifier },
          { code: identifier }
        ]
      }
    });
  },

  /**
   * Obtiene todos los tipos de vehículo.
   * @returns {Promise<Array<TypeVehicle>>} Lista de tipos de vehículo.
   */
  async getAllTypeVehicles() {
    return TypeVehicle.findAll();
  },

  /**
   * Actualiza un tipo de vehículo.
   * @param {number} typeVehicleId - ID del tipo de vehículo a actualizar.
   * @param {object} updateData - Datos a actualizar (name, code).
   * @returns {Promise<Array<number>>} Array con el número de filas actualizadas (0 o 1).
   */
  async updateTypeVehicle(typeVehicleId, updateData) {
    return TypeVehicle.update(updateData, {
      where: { type_vehicle_id: typeVehicleId } // Usar snake_case para la columna de la DB
    });
  },

  /**
   * Elimina un tipo de vehículo.
   * @param {number} typeVehicleId - ID del tipo de vehículo a eliminar.
   * @returns {Promise<number>} Número de filas eliminadas (0 o 1).
   */
  async deleteTypeVehicle(typeVehicleId) {
    return TypeVehicle.destroy({
      where: { type_vehicle_id: typeVehicleId } // Usar snake_case para la columna de la DB
    });
  }
};

module.exports = typeVehicleService;