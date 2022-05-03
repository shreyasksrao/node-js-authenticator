/*jshint esversion: 8 */
const path = require('path');

const express = require('express');
let cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const { sequelize } = require('./sequelize');

// Load the Winston logger
const logger = require('./winston.conf.js');

// Load Env config file
logger.info(`Loading the Environment file from - ${path.join(__dirname, '../config/config.env')}`);
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

// Get Env variables
const PORT = process.env.AUTH_SERVER_PORT;
const NODE_ENV = process.env.AUTH_SERVER_ENV;

logger.debug(`[ENV] PORT - ${PORT}`);
logger.debug(`[ENV] NODE_ENV - ${NODE_ENV}`);

var app = express();

// Use Body parser middleware
app.use(express.json());
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

if(NODE_ENV === "development"){
    app.use(morgan("dev"));
}

//Setting swagger Documentation
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  swagger: "2.0",
  info: {
    title: 'Node-Js-Auth API',
    version: '1.0.0',
    description: 'Documentation of Node Js Auth backend API',
    license: {
      name: "MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Shreyas KS", // your name
      email: "shreyassuryanarayan2000@gmail.com", // your email
      url: "mysite.com", // your website
    },
  },
  host: 'localhost:5001',
  basePath: '/api/v1',
  "schemes": [
    "http",
    "https"
  ],
  "securityDefinitions": {
    "bearerAuth": {
      "name": "Authorization",
      "in": "header",
      "type": "apiKey",
      "description": "JWT Authorization token"
    }
  },
  "security": [ { "bearerAuth": [] } ]
};

const swaggerJsDocoptions = {
  swaggerDefinition,
  apis: [
    path.join(__dirname  + '/routes/*.js'),
    path.join(__dirname  + '/routes/EndpointRoutes/*.js'),
    path.join(__dirname  + '/routes/PermissionRoutes/*.js'), 

    path.join(__dirname + '/models/*.js')
  ]
};

const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Auth API Doc",
};

const swaggerSpec = swaggerJSDoc(swaggerJsDocoptions);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);


// Get the routes
const login = require('./routes/loginUser.route.js');
const register = require('./routes/registerUser.route.js');
const logoutUser =require('./routes/logout.route.js');
// const forgetPassword = require('./routes/forgotPassword.route.js');
// const resetPassword = require('./routes/resetPassword.route.js');
// const updatePassword = require('./routes/updatePassword.route.js');
// const updatePasswordViaEmail = require('./routes/updatePasswordViaEmail.route.js');
const findUsers = require('./routes/findUsers.route.js');
// const deleteUser = require('./routes/deleteUser.route.js');
const updateUser = require('./routes/updateUser.route.js');
// const user_logins = require('./routes/user_logins.route.js');

const createPermission = require('./routes/PermissionRoutes/createPermission.route');
const getPermission = require('./routes/PermissionRoutes/getPermission.route');
const deletePermission = require('./routes/PermissionRoutes/deletePermission.route');
const updatePermission = require('./routes/PermissionRoutes/updatePermission.route');

const getEndpoints = require('./routes/EndpointRoutes/getEndpoint.route');
const registerEndpoint = require('./routes/EndpointRoutes/registerEndpoint.route');
const deleteEndpoint = require('./routes/EndpointRoutes/deleteEndpoint.route');
const updateEndpoint = require('./routes/EndpointRoutes/updateEndpoint.route');

app.get('/', function (req, res) {
  res.send('hello world');
});

app.use('/api/v1', login);
app.use('/api/v1', register);
app.use('/api/v1', logoutUser);
// app.use('/api/v1', forgetPassword);
// app.use('/api/v1', resetPassword);
// app.use('/api/v1', updatePassword);
// app.use('/api/v1', updatePasswordViaEmail);
app.use('/api/v1', findUsers);
// app.use('/api/v1', deleteUser);
app.use('/api/v1', updateUser);
// app.use('/api/v1', user_logins);

app.use('/api/v1', createPermission);
app.use('/api/v1', getPermission);
app.use('/api/v1', updatePermission);
app.use('/api/v1', deletePermission);

app.use('/api/v1', registerEndpoint);
app.use('/api/v1', deleteEndpoint);
app.use('/api/v1', getEndpoints);
app.use('/api/v1', updateEndpoint);

const server = app.listen(PORT, () => {
  console.log(`Authentication Service is running on Port : ${PORT}`.green.bold.underline);
  logger.info(`Authentication Service is running on Port : ${PORT}`);
});

process.on('unhandledRejection', async (err, promise) => {
    logger.error(`An Unhandled Rejection occured !!`);
    console.error(`An Unhandled Rejection occured !!`.red.bold.underline);

    logger.error(`Error: ${err.message}`);
    console.log(`Error: ${err.message}`.red.bold);

    logger.error(`Stack trace: ${err.stack}`);
    console.log(`Stack trace: ${err.stack}`.blue.italic);

    await sequelize.close();
    server.close(() => process.exit(1));
});
