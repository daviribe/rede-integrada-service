const _ = require("lodash");
const Product = require("../Entity/Product");

class ProductRepository {
  constructor(connection) {
    this.connection = connection;
    this.product = Product(connection);
  }

  async GetById(Id) {
    try {
      return await this.product.findAll({
        atributes: [
          "Id",
          "Description",
          "Barcode",
          "Packing",
          "Price",
          "Stock",
          "WasSent",
        ],
        where: {
          id: Id,
        },
        order: [["Description", "DESC"]],
        raw: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetByWasSent(wasSent) {
    try {
      return await this.product.findAll({
        atributes: [
          "Id",
          "Description",
          "Barcode",
          "Packing",
          "Price",
          "Stock",
          "CreatedAt",
          "UpdatedAt",
        ],
        where: {
          WasSent: wasSent,
        },
        order: [["Description", "DESC"]],
        raw: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async Create(product) {
    try {
      await this.product.create(product);
    } catch (error) {
      console.log(error);
    }
  }

  async Update(product) {
    try {
      await this.product.update(product, { where: { Id: product.Id } });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ProductRepository;
