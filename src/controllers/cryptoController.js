const { StatusCodes } = require('http-status-codes');

const services = require('../services');

const getAllCoins = async (req, res) => {
  const { search, pageNumber = 1 } = req.query;

  const coinData = await services.cache(
    `coin?search=${search}&pageNumber=${pageNumber}`,
    () => {
      const cryptoService = new services.CryptoApiGateway();
      return cryptoService
        .addSearch(search)
        .addPagination(pageNumber)
        .listCoins();
    }
  );

  res.status(StatusCodes.OK).json(coinData);
};

const getAllCurrencies = async (req, res) => {
  const { search, pageNumber = 1 } = req.query;

  const currencyData = await services.cache(
    `currency?search=${search}&pageNumber=${pageNumber}`,
    () => {
      const cryptoService = new services.CryptoApiGateway();
      return cryptoService
        .addSearch(search)
        .addPagination(pageNumber)
        .listCurrencies();
    }
  );

  res.status(StatusCodes.OK).json(currencyData);
};

const getExchange = async (req, res) => {
  const { base, symbol, amount, requestFrom } = req.body;

  const exchangeData = await services.cache(
    `exchange?base=${base}&symbol=${symbol}&amount=${amount}&requestFrom=${requestFrom}`,
    () => {
      const cryptoService = new services.CryptoApiGateway();
      return cryptoService.getExchange({
        base,
        symbol,
        amount,
        requestFrom,
      });
    }
  );

  res.status(StatusCodes.OK).json(exchangeData);
};

module.exports = {
  getAllCoins,
  getAllCurrencies,
  getExchange,
};
