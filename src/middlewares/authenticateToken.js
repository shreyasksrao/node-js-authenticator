/*jshint esversion: 8 */
const jwt = require('jsonwebtoken');
const { BlacklistToken, UserLogin } = require('../sequelize');
const Blacklist = BlacklistToken;
const redisClient = require('../redisClient');

const dotenv = require('dotenv');
let path = require('path');
let fs = require('fs');


dotenv.config({ path: path.join(process.cwd(), 'config/config.env') });
const token_expiry_seconds = process.env.TOKEN_EXPIRY_SECONDS;
const publickey = fs.readFileSync(path.join(process.cwd(), 'config/keys', process.env.TOKEN_SIGNING_PUBLIC_KEY), 'utf8');


//MIDDLEWARE TO AUTHENTICATE TOKEN BEFORE ACCESSING PROTECTED ROUTES
async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Send ERROR when Token is not passed in the header.
  if (token == null)
    return res.status(401).json({
      status: 401,
      message: "Token is not passed in the header. Ex: authorization: Bearer <JWT token>"
    });

  // Check the presence of token in Blacklist table
  Blacklist.findOne({ where: {token: token } })
      .then((found) => {
        // If token present in the Blacklist table, return 403
        if (found){
          details={
            "status":403,
            "message":'Forbidden !! Token blacklisted. Cannot use this token.'
          };
          return res.status(401).json(details);
        }
        // Verify the token
        else {
          jwt.verify(token, publickey, {algorithm: 'RS256'}, async (err, payload) => {
            console.log(payload);
            // Any error with token verification, throw 403
            if (err){
              console.log(err);
              return res.status(403).json({
                "status":403,
                "message":`JWT verification failed : ${err}`
              });
            }
              
            if(payload){
              const login = await UserLogin.findOne({where:{ user_id : payload.id, token_id: payload.token_id}});
              if(login.token_deleted==true){
                const blacklist_token = Blacklist.create({
                  token:token
                });
                return res.status(401);
              }
            }
            req.user = payload;
            next();
          });
        }
      });

}

module.exports = authenticateToken;