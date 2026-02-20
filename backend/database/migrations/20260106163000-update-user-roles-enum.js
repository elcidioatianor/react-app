'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // For SQLite, just update the data since ENUM is TEXT
        await queryInterface.sequelize.query(
            "UPDATE users SET role = 'buyer' WHERE role = 'user';"
        );
    },
    async down(queryInterface, Sequelize) {
        // Revert data
        await queryInterface.sequelize.query(
            "UPDATE users SET role = 'user' WHERE role = 'buyer';"
        );
    },
};
