const router = require('express').Router();
const { loggers } = require('winston');
const redisClient = require('../redisClient');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
let path = require('path');
let fs = require('fs');

dotenv.config({ path: path.join(process.cwd(), 'config/config.env') });
const publickey = fs.readFileSync(path.join(process.cwd(), 'config/jwt/keys', process.env.TOKEN_SIGNING_PUBLIC_KEY), 'utf8');


/**
 * @swagger
 * /validateToken:
 *   post:
 *     tags:
 *       - Token Validator
 *     name: Validate a token
 *     summary: Validate a token
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             accessToken:
 *               description: Unique name given to a role (Ex - User, Moderator, Admin, SuperAdmin)
 *               required: true
 *           required:
 *             - accessToken
 *     responses:
 *       '200':
 *         description: Token Verified Successfully.
 *       '403':
 *         description: Invalid Token passed (Token verification failed OR Token expired OR Token Blacklisted).
 *       '401':
 *         description: Token is not passed in the Request Body. Pass the Auth token to 'accessToken' key.
 */
router.post('/validateToken', async (req, res) => {
    try {
        const token = req.body.accessToken;
    
        // Send ERROR when Token is not passed in the Body.
        if (token == null)
          return res.status(401).json({
            status: 401,
            message: "Token is not passed in the Request Body. Pass the Auth token to 'accessToken' key"
          });
    
        else{
          jwt.verify(token, publickey, {algorithm: 'RS256'}, async (err, payload) => {
            // Any error with token verification, throw 403
            if (err){
              console.log(err);
              return res.status(200).json({
                "status":403,
                "message":`JWT verification failed : ${err}`
              });
            }
              
            if(payload){
              let current_utc = Math.floor(new Date().getTime() / 1000);
              if(current_utc > payload.eat){
                return res.status(200).json({
                  "status":403,
                  "message":`Forbidden, Token expired !!`
                });
              }
            }
    
            const tokenBlacklisted = await redisClient.exists(payload.tid);
            if(tokenBlacklisted){
              return res.status(200).json({
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

module.exports = router;