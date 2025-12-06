require("dotenv").config();

const app = require("./app");
const { Sequelize } = require("sequelize");
const dbConfig = require("./config/database");

const sequelize = new Sequelize(dbConfig);

async function start() {
  try {
    await sequelize.authenticate();
    console.log("💾 Conectado ao MariaDB");

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Backend rodando na porta ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
}

start();
