'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      vehicle.belongsTo(models.user, { foreignKey: 'userId' });
    }
  }
  vehicle.init({
    plateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'stolen'),
      allowNull: false,
      defaultValue: 'active'
    },
    gpsDeviceId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'unpaid', 'cancelled'),
      allowNull: false,
      defaultValue: 'active'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
    },
  }, {
    sequelize,
    modelName: 'vehicle',
    timestamps: true
  });
  return vehicle;
};