
const { Queue } = require("bullmq");
const bullMQRedisConnection = require("./bull.redis.connection");


const documentQueue = new Queue("documentQueue", {
  connection: bullMQRedisConnection, // use  ioredis client
  defaultJobOptions: {
    attempts: 3, // retry 3 times on failure
    backoff: { type: "exponential", delay: 5000 }, // exponential backoff
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = documentQueue;
