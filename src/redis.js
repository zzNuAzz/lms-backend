const redis = require('redis');
const { port, host } = require('config').get('redis');
const redisClient = redis.createClient(port, host);

module.exports = redisClient;
