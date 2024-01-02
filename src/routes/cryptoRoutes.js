const express = require('express');

const {
  getAllCoins,
  getAllCurrencies,
  getExchange,
} = require('../controllers/cryptoController');
const { getExchangeSchema } = require('../validation/crypto');
const { authenticateUserMiddleware } = require('../middleware/authentication');
const { validateRequest } = require('../middleware/validate-request');

const router = express.Router();

router.route('/list/coins').get(authenticateUserMiddleware, getAllCoins);
router
  .route('/list/currencies')
  .get(authenticateUserMiddleware, getAllCurrencies);
router
  .route('/exchange')
  .post(
    [authenticateUserMiddleware, getExchangeSchema, validateRequest],
    getExchange
  );

module.exports = router;
