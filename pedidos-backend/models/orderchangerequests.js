'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderChangeRequests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderChangeRequests.belongsTo(models.OrderDates, {
        foreignKey: 'order_date_id',
        as: 'orderDate'
      });
    }
  }
  OrderChangeRequests.init({
    request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    order_date_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    request_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    change_quantity: DataTypes.INTEGER,
    requested_at: DataTypes.DATE,
    admin_response_at: DataTypes.DATE,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    admin_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'OrderChangeRequests',
    tableName: 'OrderChangeRequests',
    timestamps: true,
    underscored: true
  });
  return OrderChangeRequests;
};