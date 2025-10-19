'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trackings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // 📍 Campo GEOMETRY (PostGIS)
      location: {
        type: Sequelize.GEOMETRY('POINT', 4326),
        allowNull: false
      },
      
      gpsTimestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      speed: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      direction: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      ignition: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status: {
        type: Sequelize.ENUM('moving', 'stopped', 'offline'),
        allowNull: false,
        defaultValue: 'moving'
      },
      vehicleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'vehicles', 
          key: 'id' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 3. Crear el Índice Espacial GiST (Para consultas de proximidad ultra-rápidas)
    await queryInterface.addIndex('trackings', ['location'], {
      indexName: 'tracking_location_gist_index',
      using: 'gist',
    });

  },

  async down(queryInterface, Sequelize) {
    // Eliminar el índice antes de la tabla
    await queryInterface.removeIndex('trackings', 'tracking_location_gist_index');
    await queryInterface.dropTable('trackings');
    
    // Eliminar el tipo ENUM
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_trackings_status";');
  }
};