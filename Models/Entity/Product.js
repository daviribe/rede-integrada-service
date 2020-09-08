const { Sequelize } = require("sequelize");

const Product = (connection) => {
  return connection.define("Product", {
    Id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
    },
    Description: Sequelize.STRING,
    Barcode: Sequelize.BIGINT,
    Packing: Sequelize.STRING,
    Price: Sequelize.DECIMAL,
    Stock: Sequelize.STRING,
    WasSent: Sequelize.BOOLEAN,
    DeletedAt: Sequelize.DATE,
  });
};

module.exports = Product;
