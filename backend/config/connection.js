const {Sequelize} = require('sequelize');
const dbConfig = require('./database');

const sequelize = new Sequelize(dbConfig);

async function start() {
    try {
        await sequelize.authenticate();
        console.log("💾 Conectado ao MariaDB");
    } catch (err) {
        console.error("Erro ao conectar ao banco:", err);
    }
}

start();

module.exports = sequelize;
