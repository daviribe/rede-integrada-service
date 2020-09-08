const ConnectionFactory = require("./Config/ConnectionFactory");
const ProductRepository = require("./Models/Repository/ProductRepository");
const { GetProducts }= require("./Services/ProductService");
const HttpClient = require("./Config/HttpClient");
const _ = require("lodash");
require("dotenv/config");

const UpdateProductWasSent = async (products, productRepository) => {
  for (let index = 0; index < products.length; index++) {
    products[index].WasSent = 1;

    await productRepository.Update(products[index]);
  }
};

const GetMessage = async (products, isNewProducts) => {
  let message = "*Novidades Da Rede Integrada.*\n\n";

  isNewProducts
    ? (message += `*Novos Produtos:*\n\n`)
    : (message += `*Produtos Atualizados:*\n\n`);

  for (let index = 0; index < products.length; index++) {
    let { Description, Packing, Price } = products[index];

    message += `${Description} | ${Packing} | ${Price.replace(/\./g, ".")}\n`;
  }

  return message;
};

const SendBatch = async (
  products,
  productRepository,
  httpClient,
  isNewProducts
) => {
  let message = await GetMessage(products, isNewProducts);

  try {
    await httpClient.Post("sendMessage", {
      text: message,
      chat_id: process.env.TELEGRAM_CHAT_ID,
      parse_mode: "markdown",
    });
  } catch (error) {
    console.log(error);
  }

  await UpdateProductWasSent(products, productRepository);
};

const SendProducts = async (
  products,
  productRepository,
  httpClient,
  isNewProducts
) => {
  let productsBatch = products.slice(0, 50);

  products = products.slice(productsBatch.length, products.length);

  await SendBatch(productsBatch, productRepository, httpClient, isNewProducts);

  if (products.length > 0)
    SendProducts(products, productRepository, httpClient, isNewProducts);
};

const UpdateTelegram = async (productRepository, httpClient) => {
  const products = await productRepository.GetByWasSent(false);

  const newProducts = products.filter((product) =>
    _.isEqual(product.CreatedAt, product.UpdatedAt)
  );

  const updatedProducts = products.filter(
    (product) => !_.isEqual(product.CreatedAt, product.UpdatedAt)
  );

  if (newProducts.length > 0)
    await SendProducts(newProducts, productRepository, httpClient, true);

  if (updatedProducts.length > 0)
    await SendProducts(updatedProducts, productRepository, httpClient, false);
};

const UpdateDatabase = async (productRepository) => {
  const products = await GetProducts();

  for (let index = 0; index < products.length; index++) {
    let oldProduct = await productRepository.GetById(products[index].Id);

    if (oldProduct.length === 0) {
      await productRepository.Create(products[index]);
    } else if (
      (oldProduct[0].Price !== products[index].Price,
      oldProduct[0].Packing !== products[index].Packing,
      oldProduct[0].Description !== products[index].Description)
    ) {
      products[index].WasSent = 0;

      await productRepository.Update(products[index]);
    }
  }
};

const Execute = async () => {
  try {
    const connection = await ConnectionFactory();
    const productRepository = new ProductRepository(connection);
    const httpClient = new HttpClient();

    await UpdateDatabase(productRepository);
    await UpdateTelegram(productRepository, httpClient);
  } catch (error) {
    console.log(error);
  }
};

(Main = async () => {
  await Execute();

  setTimeout(Main, process.env.TIMEOUT);
})();
