const router = require('express').Router();
const { loggers } = require('winston');
const redisClient = require('../redisClient');

const dotenv = require('dotenv');
let path = require('path');
let fs = require('fs');

dotenv.config({ path: path.join(process.cwd(), 'config/config.env') });
const publickey = fs.readFileSync(path.join(process.cwd(), 'config/jwt/keys', process.env.TOKEN_SIGNING_PUBLIC_KEY), 'utf8');


router.post('/validateToken', async (req, res) => {
    try {

      
      } catch (error) {
        console.log(`Role Validation error !!`);
        console.log(`Stack Trace: ${error.stack}`);
        return res.status(500).json({
          status: 500,
          message: `Internal Server Error. \nError: ${error}`
        });
      }
});