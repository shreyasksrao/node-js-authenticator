const router = require('express').Router();
const { loggers } = require('winston');
const redisClient = require('../redisClient');
const jwt = require('jsonwebtoken');

const { buildRoleMap } = require('../helpers/roleMapBuilder');

const dotenv = require('dotenv');
let path = require('path');
let fs = require('fs');

dotenv.config({ path: path.join(process.cwd(), 'config/config.env') });
const publickey = fs.readFileSync(path.join(process.cwd(), 'config/jwt/keys', process.env.TOKEN_SIGNING_PUBLIC_KEY), 'utf8');

var IN_MEMORY_CACHE, IN_MEMORY_ROLE_ENDPOINT_CACHE, IN_MEMORY_OBJECT_CACHE_EXPIRATION_AT;

buildRoleMap().then(result => {
  IN_MEMORY_CACHE = result.roleMap;
  IN_MEMORY_ROLE_ENDPOINT_CACHE = result.roleEndpointMap;
  IN_MEMORY_OBJECT_CACHE_EXPIRATION_AT = Math.floor(new Date().getTime() / 1000) + 12*60*60;
  console.log(IN_MEMORY_ROLE_ENDPOINT_CACHE);
});


/**
 * @swagger
 * /validateRole:
 *   post:
 *     tags:
 *       - Role Validator
 *     name: Validate a token with the Role
 *     summary: Validate a token with the Role
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
 *             requestName:
 *               type: string
 *               description: Description about the Role.
 *           required:
 *             - accessToken
 *             - requestName
 *     responses:
 *       '200':
 *         description: Role Validated successfully.
 *       '400':
 *         description: Invalid Token.
 *       '401':
 *         description: Required Parameters are not passed (accessToken and requestName are required).
 */
router.post('/validateRole', async (req, res) => {
    try {
      const token = req.body.accessToken;
      const request = req.body.requestName;
      // Send ERROR when Token is not passed in the Body.
      if (token == null)
        return res.status(401).json({
          status: 401,
          message: "Token is not passed in the Request Body. Pass the Auth token to 'accessToken' key"
        });
      
      if (request == null)
        return res.status(401).json({
          status: 401,
          message: "Request Name is not passed in the Request Body. Pass the request name to 'requestName' key"
        });
      
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

        let currentTime = Math.floor(new Date().getTime() / 1000);
        if (currentTime > IN_MEMORY_OBJECT_CACHE_EXPIRATION_AT){
            console.log(`Building Role Map due to In-Memory Cache expire...`);
            var roleMapBuilderOut = await buildRoleMap();
            IN_MEMORY_CACHE = roleMapBuilderOut.roleMap;
            IN_MEMORY_ROLE_ENDPOINT_CACHE = roleMapBuilderOut.roleEndpointMap;
            IN_MEMORY_OBJECT_CACHE_EXPIRATION_AT = Math.floor(new Date().getTime() / 1000) + 12*60*60;
            console.log(IN_MEMORY_CACHE);
        }

        let userRoles = payload.ur; 
        let endpointName = request;
        for(let i=0; i<userRoles.length; i++){
            let hasAccessToEndpoints = IN_MEMORY_ROLE_ENDPOINT_CACHE[userRoles[i]];
            if (hasAccessToEndpoints.includes('*') || hasAccessToEndpoints.includes(endpointName))
              return res.status(200).json({
                status: 200,
                message: "Has Access",
                user: payload
              });
        }
        return res.status(403).json({
          status: 403,
          message: "Has not Access"
        });
      }); 
    } catch (error) {
        console.log(`Role Validation error !!`);
        console.log(`Stack Trace: ${error.stack}`);
        return res.status(500).json({
          status: 500,
          message: `Internal Server Error. \nError: ${error}`
        });
      }
});

module.exports = router;