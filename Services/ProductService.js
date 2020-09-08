const puppeteer = require("puppeteer");
const { ClickByText } = require("../Helpers/Helpers");

const Init = async (browser) => {
  const page = await browser.newPage();
  await page.goto(process.env.LOGIN_PAGE);

  return page;
};

const Login = async (page) => {
  await page.type("#usuario", process.env.LOGIN_USER);
  await page.type("#senha", process.env.LOGIN_PASSWORD);
  await page.click("#btnAutenticar");
  await page.waitForNavigation();
  await ClickByText(page, " Novo");
  await page.waitFor(5000);
};

const EvaluteProducts = async (page) => {
  return await page.evaluate(() => {
    let products = [];

    document
      .querySelectorAll("#tabela_produto > tbody > tr")
      .forEach((line, index) => {
        let product = {};

        line
          .querySelectorAll("span")
          .forEach((span, index) => {
            switch (index) {
              case 0:
                product.Id = parseInt(span.innerText);
                break;
              case 1:
                product.Description = span.innerText;
                break;
              case 2:
                product.Barcode = parseInt(span.innerText);
                break;
              case 3:
                product.Packing = span.innerText;
                break;
              case 4:
                product.Price = span.innerText.replace(/,/g, ".");
                break;
              case 5:
                break;
              case 6:
                product.Stock = span.innerText;
                break;
              default:
                throw new Error("Code not implemented");
            }
          });

        products[index] = product;
      });

    return products;
  });
};

const GetProducts = async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  let page = await Init(browser);

  await Login(page);

  let products = await EvaluteProducts(page)

  browser.close();

  return products;
};

module.exports = { GetProducts };
