'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            firstName: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },

            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            role: {
                type: Sequelize.ENUM('client', 'seller', 'admin'),
                allowNull: false,
                defaultValue: 'client',
            },

            refreshTokenHash: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            lastLoginAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    },
};
