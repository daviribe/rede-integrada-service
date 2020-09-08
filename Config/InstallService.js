require("dotenv/config");

const Service = require("node-windows").Service;

const service = new Service({
  name: "Rede Integrada Service",
  description: "Serviço de envio de atualizações da Rede Integrada",
  script: process.env.INDEX_PATH,
});

service.on("install", () => {
  service.start();
});

service.install();
