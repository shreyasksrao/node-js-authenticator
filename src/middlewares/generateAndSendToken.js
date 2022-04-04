/*jshint esversion: 8 */

let jwt = require('jsonwebtoken');
let customId = require("custom-id");
let Sequelize = require("sequelize");
let { User, UserLogin } = require('../sequelize');
const dotenv = require('dotenv');
let path = require('path');
let fs = require('fs');


dotenv.config({ path: path.join(process.cwd(), 'config/config.env') });
const token_expiry_seconds = parseInt(process.env.TOKEN_EXPIRY_SECONDS);
const privateKey = fs.readFileSync(path.join(process.cwd(), 'config/keys', process.env.TOKEN_SIGNING_PRIVATE_KEY), 'utf8');


var generateAccessToken = async function(req, token_id, userRoles, userStatus) {
  let issued_at = Math.floor(new Date().getTime() / 1000);
  const token_payload = { 
    id:req.auth.id , 
    tid: token_id,
    ur: userRoles,
    us: userStatus,
    iby: process.env.ISSUER_NAME,
    iat: issued_at,
    eat: issued_at + token_expiry_seconds
  };
  const accessToken = await jwt.sign(token_payload, privateKey, {algorithm: 'RS256'});
  return accessToken;
};

var createToken = async function(req) {
  try{
    const token_id = await customId({
      user_id : req.auth.id,
      date : Date.now(),
      randomLength: 4 
    });

    // Get the User ROLE
    var userRoles = [];
    var userStatus = 'inactive';
    const user = await User.findOne({where:{ id: req.auth.id }});
    if (user){
      userRoles = user.role;
      userStatus = user.status;
    }

    //Fetch the IP address of the remote client.
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress;

    // Get all the User login instances from the same Device and IP to update the Tokens.
    const user_logins=await UserLogin.findAll({
        user_id: req.auth.id ,
        ip_address: ip
    });
    // Update the token in the UserLogin table.
    user_logins.forEach(async(login) => {
      if(login){
        if (login.device == req.headers["user-agent"]){
          const accessToken = await generateAccessToken(req, token_id, userRoles, userStatus);
          login.logged_in_at = Sequelize.literal("CURRENT_TIMESTAMP");
          login.token_id = token_id;
          await login.save();
          return {
            accessToken: accessToken,
            code: 1,
            message: `Token generated successfully.`
          };
        }
      }      
    });

    // New device Logged-in , Add a UserLogin entry in the Table with all the new Session details
    const loginRecord = await UserLogin.create({
      user_id : req.auth.id,
      token_id : token_id,
      ip_address : ip,
      device : req.headers["user-agent"]
    });
    const accessToken = await generateAccessToken(req, token_id, userRoles, userStatus);
    return {
      accessToken: accessToken,
      code: 2,
      message: `Login from other device !`,
      ipAddress: ip,
      deviceAgent: req.headers["user-agent"]
    };  
  }
  catch(e){
    console.log(`[ERROR] Internal Server Error ${e.message}\nStack trace: ${e}`);
    return {
      code: -1,
      message: e.message,
      devMessage: e.stack
    };
  } 
};

module.exports = {
  generateAndSendToken: async function(req, res, next) {
      let tokenResponse = await createToken(req);
      if (tokenResponse.code == -1)
        return res.status(500).json({
          statusCode: 500,
          message: tokenResponse.message,
          devMessage: tokenResponse.devMessage
        });
      else 
        return res.status(200).json(tokenResponse);
  }
};