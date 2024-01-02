const Joi = require('joi');

const getExchangeSchema = (req, res, next) => {
  const schema = Joi.object().keys({
    base: Joi.string().trim().required(),
    symbol: Joi.string().trim().required(),
    amount: Joi.number().required(),
    requestFrom: Joi.string().trim().required(),
  });

  req.schema = schema;

  next();
};

module.exports = {
  getExchangeSchema,
};
