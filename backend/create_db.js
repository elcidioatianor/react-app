const mariadb = require('mariadb');
require('dotenv').config();

async function createDatabase() {
    let conn;
    try {
        conn = await mariadb.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });

        await conn.query(
            `CREATE DATABASE IF NOT EXISTS ${process.env.DEV_DATABASE}`
        );
        console.log(
            `Database ${process.env.DEV_DATABASE} created successfully or already exists.`
        );
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        if (conn) conn.end();
    }
}

createDatabase();
