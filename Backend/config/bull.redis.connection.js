const IORedis = require("ioredis");

const bullMQRedisConnection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, // must be null for BullMQ
  enableOfflineQueue: true, 
});

bullMQRedisConnection.on("connect", () => console.log("✅IO Redis connected.........."));
bullMQRedisConnection.on("error", (err) => console.error("IO Redis error:", err));

module.exports = bullMQRedisConnection;