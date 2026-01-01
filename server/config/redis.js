const redis = require("redis");

let redisClient;

const connectRedis = async () => {
  redisClient = redis.createClient({
    url:
      process.env.REDIS_URL ||
      `redis://localhost:${process.env.REDIS_PORT || 6379}`,
  });

  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  redisClient.on("connect", () => console.log("Redis Client Connected"));

  try {
    await redisClient.connect();
  } catch (error) {
    console.log("Could not connect to Redis, caching will be disabled.");
  }
};

const getClient = () => redisClient;

module.exports = { connectRedis, getClient };
