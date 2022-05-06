/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Endpoint } = require('../../sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');
const { validateBodyParamsExistence } = require('../../utils/validateBodyParameters');
const { VALID_METHODS, httpMethodsValidator } = require('../../validators/httpMethodsValidator');

let addEndpointAlias = require("../../middlewares/addEndpointAlias");
/**
 * @swagger
 * /createEndpoint:
 *   post:
 *     tags:
 *       - Endpoint
 *     name: Create an Endpoint
 *     summary: Create a new Endpoint in the DB
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
 *             name:
 *               type: string
 *               description: Name given to an Endpoint (Should match with the 'name' given in the API implementation)
 *             endpoint:
 *               type: string
 *               description: REST endpoint to which the permission is assigned.
 *             method:
 *               type: string
 *               description: HTTP method
 *             description:
 *               type: string
 *               description: Description about the permission.
 *           required:
 *             - name
 *             - description
 *             - endpoint
 *             - method
 *     responses:
 *       '200':
 *         description: Endpoint created successfully.
 *       '400':
 *         description: Endpoint already exists.
 *       '401':
 *         description: Parameter validation failed.
 */

router.post('/createEndpoint', addEndpointAlias('create_new_endpoint'), async (req, res) => {
  // Validate weather the request body contains all the parameters or not
  var bodyParameterValidationResult = validateBodyParamsExistence(req, ['name', 'description', 'endpoint', 'method']);
  if (bodyParameterValidationResult.status == false){
    logger.debug(`Body parameter validation error: ${bodyParameterValidationResult.message}`);
    return res.status(401).send({
      statusCode: 401,
      message: bodyParameterValidationResult.message
    });
  }
  if (! httpMethodsValidator(req.body.method)) {
    return res.status(401).send({
        statusCode: 401,
        message: `Invalid HTTP method passed. Valid methods are: ${VALID_METHODS}`
    });
  }
  logger.debug(`Validated body parameters successfully...`);

  // If User exists, then throw the Error
  const endpointExists = await Endpoint.findOne({ where: {
      name: req.body.name
    }
  });
  if (endpointExists){
    logger.info(`Endpoint with the name "${req.body.name}" already exists !!`);
    logger.debug(`Endpoint details -- Endpoint: ${req.body.endpoint}, Method: ${req.body.method}`);
    return res.status(400).send({
      statusCode: 400,
      message: `Bad request !! - Endpoint with the name "${req.body.name}" already exists`,
    });
  }

  // Create a Endpoint in the DB
  try {
    logger.debug(`Creating an Endpoint -- Name: ${req.body.name}, Endpoint: ${req.body.endpoint}, Method: ${req.body.method}`);
    const savedEndpoint = await Endpoint.create({
      name: req.body.name,
      description: req.body.description,
      endpoint: req.body.endpoint,
      method: req.body.method
    });
    logger.info(`Endpoint created and saved in the DB -- ID: ${savedEndpoint.id}, Name: ${req.body.name}, Endpoint: ${savedEndpoint.endpoint}, Method: ${savedEndpoint.method}`);
    return res.status(201).send({
      statusCode: 201,
      message: `Endpoint has been created. ID: ${savedEndpoint.id}, Name: ${req.body.name}, Endpoint: ${savedEndpoint.endpoint}, Method: ${savedEndpoint.method}`,
    });
  } 
  catch (err) {
      logger.error(err);
      return res.status(500).send({
        statusCode: 500,
        message: 'Internal Server Error !!!',
        devMessage: err.message,
        stackTrace: err.stack
      });
  }
});


module.exports=router;