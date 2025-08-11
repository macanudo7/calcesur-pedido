'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.TypeVehicle, {
        foreignKey: 'type_vehicle_id',
        as: 'typeVehicle' // Alias opcional para la relación
      });

      Product.hasMany(models.Order, {
        foreignKey: 'product_id',
        as: 'orders'
      });
    }
  }
  Product.init({
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    type_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    spec_sheet_url: { 
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    timestamps: true,
    underscored: true
  });
  return Product;
};