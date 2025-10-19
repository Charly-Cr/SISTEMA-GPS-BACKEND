'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      plateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'stolen'),
        allowNull: false,
        defaultValue: 'active'
      },
      gpsDeviceId: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      subscriptionStatus: {
        type: Sequelize.ENUM('active', 'unpaid', 'cancelled'),
        allowNull: false,
        defaultValue: 'active'
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { 
          model: 'users', 
          key: 'id' },
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
      },
    });

    // Índices opcionales para búsquedas rápidas
    await queryInterface.addIndex('vehicles', ['userId']);
    await queryInterface.addIndex('vehicles', ['gpsDeviceId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehicles');
    // eliminar tipos ENUM en Postgres para evitar conflictos al migrar otra vez
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_vehicles_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_vehicles_subscriptionStatus";');
  }
};