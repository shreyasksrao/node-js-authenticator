const axios = require('axios');

const dotenv = require('dotenv');
let path = require('path');

dotenv.config({ path: path.join(process.cwd(), 'config/config.env') });

const headers = {
    'Content-Type': 'application/json',
};

const TOKEN_VALIDATOR_SERVER_PORT = process.env.TOKEN_VALIDATOR_SERVER_PORT;
const TOKEN_VALIDATOR_SERVER_HOST = process.env.TOKEN_VALIDATOR_SERVER_HOST;

if(TOKEN_VALIDATOR_SERVER_PORT == undefined){
    console.error(`[ ERROR ] Environment variable "TOKEN_VALIDATOR_SERVER_PORT" is not defined`);
    process.exit(-1);
}
if(TOKEN_VALIDATOR_SERVER_HOST == undefined){
    console.error(`[ ERROR ] Environment variable "TOKEN_VALIDATOR_SERVER_HOST" is not defined`);
    process.exit(-1);
}

let tokenValidationEndpoint = `http://${TOKEN_VALIDATOR_SERVER_HOST}:${TOKEN_VALIDATOR_SERVER_PORT}/api/v1/validateToken`;
    

async function authenticateTokenUsingService(req, res, next){
    try {
        const token = req.headers['x-auth-token'];

        // Send ERROR when Token is not passed in the header.
        if (token == null)
        return res.status(401).json({
            status: 401,
            message: "Token is not passed in the header. Ex: x-auth-token: <JWT token>"
        });

        let response = await axios.post(tokenValidationEndpoint,
                                        {accessToken: token},
                                        headers);
        if (response.data.status == 200){
            req.user = response.data.user;
            next();
        }
        else 
            return res.status(response.data.status).json(response.data);
    } catch (error) {
        console.log(`Token Validation error !!`);
        console.log(`Stack Trace: ${error}`);
        return res.status(500).json({
          status: 500,
          message: `Internal Server Error. \nError: ${error}`
        });
    }
}

module.exports = {
    authenticateTokenUsingService,
}