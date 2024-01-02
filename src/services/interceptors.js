const axios = require('axios');
const { StatusCodes } = require('http-status-codes');

const listFetch = axios.create({
  baseURL: process.env.COIN_RANKING_URL,
});

listFetch.interceptors.request.use(
  (request) => {
    request.headers['X-RapidAPI-Key'] = process.env.COIN_RANKING_KEY;
    request.headers['X-RapidAPI-Host'] = process.env.COIN_RANKING_HOST;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

listFetch.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);
    return Promise.reject({});
  }
);

const exchangeFetch = axios.create({
  baseURL: process.env.CRYPTO_MARKET_URL,
});

exchangeFetch.interceptors.request.use(
  (request) => {
    request.headers['X-RapidAPI-Key'] = process.env.CRYPTO_MARKET_KEY;
    request.headers['X-RapidAPI-Host'] = process.env.CRYPTO_MARKET_HOST;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

exchangeFetch.interceptors.response.use(
  (response) => {
    if (response.data.error) {
      return Promise.reject({
        statusCode: StatusCodes.BAD_REQUEST,
        message: response.data.message,
      });
    }
    return response.data;
  },
  (error) => {
    console.log(error);
    return Promise.reject({});
  }
);

module.exports = { listFetch, exchangeFetch };
