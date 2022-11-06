const redis = require("redis");

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB_NUM,
    password: process.env.REDIS_PASSWORD,
    legacyMode: true,
});

(async () => {
    redisClient.connect();
})();

module.exports = redisClient;
