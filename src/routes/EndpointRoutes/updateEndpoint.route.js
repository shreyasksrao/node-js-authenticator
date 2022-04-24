/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Endpoint } = require('../../sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');
const { validateBodyParamsExistence } = require('../../utils/validateBodyParameters');
const { VALID_METHODS, httpMethodsValidator } = require('../../validators/httpMethodsValidator');
/**
 * @swagger
 * /updateEndpoint/{endpointId}:
 *   put:
 *     tags:
 *       - Endpoint
 *     name: Updates an Endpoint
 *     summary: Update an existing Endpoint in the DB
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: endpointId
 *         required: true
 *         schema:
 *           type: UUID
 *         description: Endpoint ID
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
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
 *             - description
 *             - endpoint
 *             - method
 *     responses:
 *       '200':
 *         description: Endpoint updated successfully.
 *       '400':
 *         description: Endpoint doesn't exists.
 *       '401':
 *         description: Parameter validation failed.
 */

router.put('/updateEndpoint/:endpointId', async (req, res) => {
  // Validate weather the request body contains all the parameters or not
  var bodyParameterValidationResult = validateBodyParamsExistence(req, ['description', 'endpoint', 'method']);
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

  try{
    // If endpoint exists then only Update
    const endpointExists = await Endpoint.findOne({ where: {
            id: req.params.endpointId
        }
    });
    logger.debug(`[ UPDATE ENDPOINT ] Details -- Endpoint: ${req.body.endpoint}, Method: ${req.body.method}`);
    if (endpointExists){
        endpointExists.endpoint = req.body.endpoint;
        endpointExists.method = req.body.method;
        endpointExists.description = req.body.description;
        await endpointExists.save();
        logger.debug(`[ UPDATE ENDPOINT ] Successfully updated endpoint. Details -- Endpoint: ${req.body.endpoint}, Method: ${req.body.method}`);
        return res.status(200).send({
        statusCode: 200,
        message: `Endpoint Updated Successfully. Details -- Endpoint: ${req.body.endpoint}, Method: ${req.body.method}`
        });
    }
    else {
        logger.error(`[ UPDATE ENDPOINT ] Failed updated endpoint. Details -- Endpoint with ID ${req.params.endpointId} doesn't exist`);
        return res.status(400).send({
        statusCode: 400,
        message: `Failed updated endpoint. Details -- Endpoint with ID ${req.params.endpointId} doesn't exist`
        });
    }
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