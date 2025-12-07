//connect to DB
const {sequelize} = require("../database/models/index");

async function connect() {
  try {
	console.log("\n[+] Testando a conexão ao servidor MariaDB...");
    await sequelize.authenticate();
	console.log("[√] Conectado");

	console.log("\n[+] Sincronizando models e tabelas..." )
	sequelize.sync()
		.then(() => {
			console.log("[√] Base de dados sicronizada")
		}).catch(err => {
			console.error("[!] Erro ao sincronizar base de dados: " + err.message)
		})

	/*
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Backend rodando na porta ${process.env.PORT}`);
    });
	*/
  } catch (err) {
    console.error("[!] Erro ao conectar à base de dados:", err.message);
  }
}

connect();