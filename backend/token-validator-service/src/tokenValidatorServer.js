/*jshint esversion: 8 */
const path = require('path');

const express = require('express');
let cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

// Load the Winston logger
const logger = require('./winston.conf.js');

// Load Env config file
logger.info(`Loading the Environment file from - ${path.join(__dirname, '../config/config.env')}`);
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

// Get Env variables
const PORT = process.env.TOKEN_VALIDATOR_SERVER_PORT;
const NODE_ENV = process.env.TOKEN_VALIDATOR_SERVER_ENV;

logger.debug(`[ENV] PORT - ${PORT}`);
logger.debug(`[ENV] NODE_ENV - ${NODE_ENV}`);

var app = express();

// Use Body parser middleware
app.use(express.json());
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
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
    title: 'Node-Js-Auth API (Token Validator Service)',
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
  host: 'localhost:5002',
  basePath: '/api/v1',
  "schemes": [
    "http",
    "https"
  ]
};

const swaggerJsDocoptions = {
  swaggerDefinition,
  apis: [
    path.join(__dirname + '/routes/*.js')
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

const validateRole = require('./routes/validateRole.route');
const validateToken = require('./routes/validateToken.route');

app.get('/', function (req, res) {
  res.send('hello world');
});

app.use('/api/v1', validateRole);
app.use('/api/v1', validateToken);

const server = app.listen(PORT, () => {
  console.log(`Token Validator Service is running on Port : ${PORT}`.green.bold.underline);
  logger.info(`Token Validator Service is running on Port : ${PORT}`);
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
