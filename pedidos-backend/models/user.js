'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, {
        foreignKey: 'user_id',
        as: 'orders'
      })
    }
  }
  User.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    ruc: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    passwordHash: { // Propiedad en camelCase
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    userType: { // Propiedad en camelCase
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'client'
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active'
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    usualProductsNotes: { // Propiedad en camelCase
      type: DataTypes.TEXT,
      allowNull: true
    },
    ccEmails: { // Propiedad en camelCase
      type: DataTypes.TEXT,
      allowNull: true
    },
    leadTimeDays: { // Propiedad en camelCase
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
    underscored: true
  });
  return User;
};