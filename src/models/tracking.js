'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tracking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tracking.belongsTo(models.vehicle, { foreignKey: 'vehicleId' });
    }
  }
  tracking.init({
    // 📍 Campo clave PostGIS (GEOMETRY)
    location: {
      // Usamos 'POINT' (latitud, longitud) y SRID 4326 (estándar GPS)
      type: DataTypes.GEOMETRY('POINT', 4326), 
      allowNull: false
    },
    
    // Hora reportada por el dispositivo GPS (es más fiable que el 'createdAt' de la DB)
    gpsTimestamp: { 
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    // Telemetría básica (Sensores)
    speed: { 
      type: DataTypes.FLOAT, 
      allowNull: true,
      comment: 'Velocidad en km/h' 
    },
    direction: { 
      type: DataTypes.FLOAT, 
      allowNull: true,
      comment: 'Dirección en grados (0-360)'
    },
    ignition: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Estado del motor: Encendido (true) / Apagado (false)'
    },
    status: { 
      type: DataTypes.ENUM('moving', 'stopped', 'offline'), 
      allowNull: false, 
      defaultValue: 'moving',
      comment: 'Estado de movimiento reportado por el dispositivo'
    },
    
    // Clave Foránea
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehicle',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'tracking',
    timestamps: true, // Incluye createdAt y updatedAt
    // Opcional: Define el índice espacial para el modelo
    indexes: [
      {
        fields: ['location'],
        using: 'GIST', // Tipo de índice espacial
        name: 'tracking_location_gist'
      }
    ]
  });

  return tracking;
};