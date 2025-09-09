'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderDates.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
      });
      OrderDates.hasMany(models.OrderChangeRequests, {
        foreignKey: 'order_date_id',
        as: 'changeRequests'
      });
    }
  }
  OrderDates.init({
    order_date_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    delivery_date: DataTypes.DATE,
    delivery_date: DataTypes.DATEONLY,
    quantity: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    is_delivered: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    assigment_date: DataTypes.DATE,
    driverName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'driver_name'
    },
    vehiclePlate: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'vehicle_plate'
    }
  }, {
    sequelize,
    modelName: 'OrderDates',
    tableName: 'OrderDates',
    timestamps: true,
    underscored: true
  });
  return OrderDates;
};