const mongoose = require('mongoose');
const redis = require('redis');

const connectDB = (url) => mongoose.connect(url);

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
   socket: {
    tls: false,
  },
});

module.exports = { connectDB, redisClient };
