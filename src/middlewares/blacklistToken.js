/*jshint esversion: 8 */
/* eslint-disable no-console */

const jwt = require('jsonwebtoken');
const redisClient = require('../redisClient');

async function isBlacklisted(token_id) {
  try {
    const reply = await redisClient.exists(token_id);
    if(reply == 1)
      return true;
    else 
      return false;
  } catch (error) {
    console.log(`Error while checking the token's presence in Redis cache !!`);
    console.error(`Error: ${error.message}\nStack: ${error.stack}`);
    Promise.reject('Redis Error !! Stopping the server...');
  }
}

async function blacklistToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null)
    return res.status(401).send({
      statusCode: 401,
      message: `JWT token is not present in the Authorization header !`
    });
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    let currentUtc = Math.floor(new Date().getTime() / 1000);
    if (payload.eat < currentUtc)
      return res.status(401).json({
        statusCode: 403,
        message: 'Forbidden, Token expired !!'
      });
    else if (isBlacklisted(token))
      return res.status(401).json({
        statusCode: 403,
        message: 'Token already Blacklisted !!'
      });
    else{
      try {
        await redisClient.set(String(token), String(payload.id), 'EX', 60*60);
        return res.status(200).json({
          statusCode: 201,
          message: `Token Blacklisted successfully`
        });
      } catch (error) {
        console.log(`Error while Setting the Cache !! Redis Error`);
        console.error(`Error: ${error.message}\nStack: ${error.stack}`);
        Promise.reject(`Redis Error !! Failed to SET a blacklist token`);
      }
    }
  });
  next();
}

module.exports = {
  blacklistToken
};