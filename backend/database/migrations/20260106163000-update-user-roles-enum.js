'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Alterar o ENUM da coluna role para incluir 'client' e 'seller'.
         * No MariaDB, temos um problema:
         * 1. Não podemos mudar o ENUM se houver dados 'user'.
         * 2. Não podemos mudar o dado 'user' para 'client' se o ENUM atual não aceitar 'client'.
         * 
         * Solução: Converter temporariamente para VARCHAR, atualizar os dados e depois converter para o novo ENUM.
         */

        // 1. Converter para VARCHAR
        await queryInterface.sequelize.query(
            "ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL;"
        );

        // 2. Atualizar os dados
        await queryInterface.sequelize.query(
            "UPDATE users SET role = 'client' WHERE role = 'user';"
        );

        // 3. Converter para o novo ENUM
        await queryInterface.sequelize.query(
            "ALTER TABLE users MODIFY COLUMN role ENUM('client', 'seller', 'admin') NOT NULL DEFAULT 'client';"
        );
    },
    async down(queryInterface, Sequelize) {
        /**
         * Reverter para os valores originais.
         * Cuidado: Isso pode causar erro se houver usuários com role 'seller' ou 'client'.
         */
        await queryInterface.sequelize.query(
            "ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user';"
        );
    }
};
