require("dotenv/config");

const { Sequelize } = require("sequelize");

const ConnectionFactory = async () => {
  try {
    const connection = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
      dialect: "mysql", logging: false
    });

    await connection.authenticate();

    return connection;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = ConnectionFactory;
