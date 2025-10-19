'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.vehicle, { foreignKey: 'userId' });
      //user.hasOne(models.vehicle, { foreignKey: "userId" });
    }
  }
  user.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [6, 100] }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { len: [6, 20] }
    },
    role: {
      type: DataTypes.ENUM('superadmin', 'admin', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'user',
    timestamps: true
  });
  return user;
};