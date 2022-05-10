/*jshint esversion: 8 */

let jwt = require('jsonwebtoken');
let customId = require("custom-id");
let Sequelize = require("sequelize");
let { UserLogin } = require('../sequelize');
const dotenv = require('dotenv');
let path = require('path');
let fs = require('fs');

const logger = require('../winston.conf.js');


dotenv.config({ path: path.join(process.cwd(), 'config/config.env') });
const token_expiry_seconds = parseInt(process.env.ACCESS_TOKEN_EXPIRY_SECONDS);
const refresh_token_expiry_seconds = parseInt(process.env.REFRESH_TOKEN_EXPIRY_SECONDS);
const privateKey = fs.readFileSync(path.join(process.cwd(), 'config/jwt', process.env.TOKEN_SIGNING_PRIVATE_KEY), 'utf8');


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

var generateRefreshToken = async function(req, token_id) {
  let issued_at = Math.floor(new Date().getTime() / 1000);
  const token_payload = { 
    id:req.auth.id , 
    tid: token_id,
    iby: process.env.ISSUER_NAME,
    iat: issued_at,
    eat: issued_at + refresh_token_expiry_seconds
  };
  const refreshToken = await jwt.sign(token_payload, privateKey, {algorithm: 'RS256'});
  return refreshToken;
};

var createToken = async function(req) {
  try{
    const token_id = customId({
      user_id : req.auth.id,
      date : Date.now(),
      randomLength: 4 
    });

    // Get the User ROLE
    var userRoles = req.user.roles;
    var userStatus = req.user.status;

    //Fetch the IP address of the remote client.
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress;

    // Get all the User login instances from the same Device and IP to update the Tokens.
    const user_logins=await UserLogin.findAll({
      where:{
        user_id: req.auth.id ,
        ip_address: ip
      }
    });

    const deviceExists = await user_logins.find(obj => obj.device == req.headers["user-agent"]);
    // Update the token in the UserLogin table.
    if (deviceExists){
      for (var i=0; i<user_logins.length; i++){
        var login = user_logins[i];
        if(login){
          if (login.device == req.headers["user-agent"]){
            const accessToken = await generateAccessToken(req, token_id, userRoles, userStatus);
            const refreshToken = await generateRefreshToken(req, token_id);
            const currentTime = new Date(new Date().toUTCString());
            login.logged_in_at = currentTime;
            login.token_id = token_id;
            await login.save();
            return {
              accessToken: accessToken,
              refreshToken: refreshToken,
              authCode: 1,
              message: `Token generated successfully.`
            };
          }
        } 
      }
    }
    else {
      // New device Logged-in , Add a UserLogin entry in the Table with all the new Session details
      const loginRecord = await UserLogin.create({
        user_id : req.auth.id,
        token_id : token_id,
        ip_address : ip,
        device : req.headers["user-agent"]
      });
      const accessToken = await generateAccessToken(req, token_id, userRoles, userStatus);
      const refreshToken = await generateRefreshToken(req, token_id);
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        authCode: 2,
        message: `Successfully Logged-in from other device !`,
        loggedInAt: Date.now(),
        ipAddress: ip,
        deviceAgent: req.headers["user-agent"]
      };
    }
  }
  catch(e){
    logger.error(`Internal Server Error ${e.message}\nStack trace: ${e}`);
    return {
      authCode: -1,
      message: e.message,
      devMessage: e.stack
    };
  } 
};

module.exports = {
  generateAndSendToken: async function(req, res, next) {
      let tokenResponse = await createToken(req);
      if (tokenResponse.authCode == -1)
        return res.status(500).json({
          statusCode: 500,
          message: tokenResponse.message,
          devMessage: tokenResponse.devMessage
        });
      else 
        return res.status(200).json(tokenResponse);
  }
};