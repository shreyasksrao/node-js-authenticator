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

let roleValidationEndpoint = `http://${TOKEN_VALIDATOR_SERVER_HOST}:${TOKEN_VALIDATOR_SERVER_PORT}/api/v1/validateRole`;
    

async function roleValidationUsingService(req, res, next){
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        // Send ERROR when Token is not passed in the header.
        if (token == null)
        return res.status(401).json({
            status: 401,
            message: "Token is not passed in the header. Ex: authorization: Bearer <JWT token>"
        });

        let response = await axios.post(roleValidationEndpoint,
                                        {accessToken: token, requestName: req.endpointName},
                                        headers);
        if (response.data.status == 200){
            req.user = response.data.user;
            next();
        }
        else 
            return res.status(response.data.status).json(response.data);
    } catch (error) {
        console.log(`Token Validation error !!`);
        console.log(`Stack Trace: ${error.stack}`);
        return res.status(500).json({
          status: 500,
          message: `Internal Server Error. \nError: ${error}`
        });
    }
}

module.exports = {
    roleValidationUsingService,
}