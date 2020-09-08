require("dotenv/config");

const axios = require("axios");

class HttpClient {
  async Post(uri, data) {
    try {
      axios({
        method: "post",
        url: process.env.BASE_URL + uri,
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = HttpClient;
