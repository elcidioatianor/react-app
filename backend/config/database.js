require('dotenv').config()

module.exports = {
  "use_env_variable": false,
  "development": {
    "username": process.env.DB_USERNAME || "root",
    "password": process.env.DB_PASSWORD || "fdsms@2025",
    "database": process.env.DEV_DATABASE || "dubaning_db",
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT || 'sqlite',
    "storage": process.env.DB_DIALECT === 'sqlite' ? './database.sqlite' : undefined,
    dialectOptions: {
      allowPublicKeyRetrieval: true
    },
    define: {
      freezeTableName: true,
      underscored: true
    }
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.TEST_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    dialectOptions: {
      allowPublicKeyRetrieval: true
    }
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.PROD_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    dialectOptions: {
      allowPublicKeyRetrieval: true
    }
  }
}
