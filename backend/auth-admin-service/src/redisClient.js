/*jshint esversion: 9 */
/* eslint-disable no-console */

const redis = require('redis');
const path = require('path');
const dotenv = require('dotenv');
const { promisify } = require("util");

// Load the Winston logger
const logger = require('./winston.conf.js');

// Load Env config file
logger.info(`In REDIS utility - Loading the Environment file from - ${path.join(__dirname, '../config/config.env')}`);
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASS = process.env.REDIS_PASS;

const redisClient = redis.createClient({ 
  socket: { 
    port: REDIS_PORT, 
    host: REDIS_HOST
  },
  password: REDIS_PASS 
});
redisClient.connect()
.then(() => {
  console.log(`[INFO] - Connected to Redis server (${REDIS_HOST} on ${REDIS_PORT})`);
})
.catch(err => {
  console.log(`Redis Connection Error`);
  console.error(err);
});

redisClient.ping();

redisClient.on('error', err => {
  console.error(err);
})

module.exports = redisClient;
