const { listFetch, exchangeFetch } = require('./interceptors');

const defaultParams = {
  TIME_PERIOD: '3h',
  LIMIT: 20,
  OFFSET: 0,
  TIER: 1,
  CURRENCY_TYPE: 'fiat',
};

class CryptoApiGateway {
  constructor() {
    this.TIER = defaultParams.TIER;
    this.timePeriod = defaultParams.TIME_PERIOD;
    this.limit = defaultParams.LIMIT;
    this.offset = defaultParams.OFFSET;
    this.currencyType = defaultParams.CURRENCY_TYPE;
    this.search = '';
  }

  _getPagination(total) {
    const totalCount = total;
    const totalPages = Math.ceil(totalCount / this.limit);

    return { totalCount, totalPages };
  }

  addPagination(pageNumber) {
    if (pageNumber) {
      this.offset = (pageNumber - 1) * this.limit;
    }

    return this;
  }

  addSearch(search) {
    if (search) {
      this.search = search;
    }
    return this;
  }

  async listCoins() {
    const params = {
      limit: this.limit,
      offset: this.offset,
      search: this.search,
      ['tiers[0]']: this.TIER,
    };
    const response = await listFetch.get('/coins', {
      params,
    });

    const result = response.data.coins.map((coin) => {
      return {
        symbol: coin.symbol,
        name: coin.name,
        iconUrl: coin.iconUrl,
      };
    });

    const { totalCount, totalPages } = this._getPagination(
      response.data.stats.total
    );

    return { result, totalPages, totalCount };
  }

  async listCurrencies() {
    const params = {
      limit: this.limit,
      offset: this.offset,
      search: this.search,
      ['types[0]']: this.currencyType,
    };

    const response = await listFetch.get('/reference-currencies', {
      params,
    });

    const result = response.data.currencies.map((currency) => {
      return {
        symbol: currency.symbol,
        name: currency.name,
        iconUrl: currency.iconUrl,
      };
    });

    const { totalCount, totalPages } = this._getPagination(
      response.data.stats.total
    );

    return { result, totalPages, totalCount };
  }

  _calculateCurrencyAmount(price, amount) {
    return price * amount;
  }

  _calculateCoinPrice(price, amount) {
    return (1 / price) * amount;
  }

  _transformExchangeResponse({ response, amount, requestFrom }) {
    const {
      symbol,
      base,
      tokens: [{ price }],
    } = response;

    let toAmount;

    if (symbol === requestFrom) {
      toAmount = +this._calculateCurrencyAmount(+price, amount).toFixed(10);
    } else {
      toAmount = +this._calculateCoinPrice(+price, amount).toFixed(10);
    }

    return { symbol, base, toAmount, amount, requestFrom };
  }

  async getExchange({ base, symbol, amount, requestFrom }) {
    const params = {
      base,
    };

    const response = await exchangeFetch.get(`/tokens/${symbol}`, {
      params,
    });

    return this._transformExchangeResponse({
      response: response.data,
      amount,
      requestFrom,
    });
  }
}

module.exports = CryptoApiGateway;
