const redis = require("redis");

const redisClient = redis.createClient({
    host: process.env.REDIS_CHANNEL_HOST,
    port: process.env.REDIS_CHANNEL_PORT,
    db: process.env.REDIS_CHANNEL_DB_NUM,
    password: process.env.REDIS_CHANNEL_PASSWORD,
    legacyMode: true,
});

(async () => {
    redisClient.connect();
})();

module.exports = redisClient;
