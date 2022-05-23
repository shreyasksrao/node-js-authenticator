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
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
    
        // Send ERROR when Token is not passed in the header.
        if (token == null)
          return res.status(401).json({
            status: 401,
            message: "Token is not passed in the header. Ex: authorization: Bearer <JWT token>"
          });
    
        else{
          jwt.verify(token, publickey, {algorithm: 'RS256'}, async (err, payload) => {
            // Any error with token verification, throw 403
            if (err){
              console.log(err);
              return res.status(403).json({
                "status":403,
                "message":`JWT verification failed : ${err}`
              });
            }
              
            if(payload){
              let current_utc = Math.floor(new Date().getTime() / 1000);
              if(current_utc > payload.eat){
                return res.status(403).json({
                  "status":403,
                  "message":`Forbidden, Token expired !!`
                });
              }
            }
    
            const tokenBlacklisted = await redisClient.exists(payload.tid);
            if(tokenBlacklisted){
              return res.status(403).json({
                status: 403,
                message: "Token is Blacklisted. Please login again with your credentials"
              });
            }
            
            return res.status(200).json({
              status: 200,
              message: "Token Verified Successfully",
              user: payload
            });
          });
        } 
      } catch (error) {
        console.log(`Token Validation error !!`);
        console.log(`Stack Trace: ${error.stack}`);
        return res.status(500).json({
          status: 500,
          message: `Internal Server Error. \nError: ${error}`
        });
      }
});