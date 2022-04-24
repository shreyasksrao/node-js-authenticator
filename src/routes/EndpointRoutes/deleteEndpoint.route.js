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
 * /deleteEndpoint:
 *   post:
 *     tags:
 *       - Endpoint
 *     name: Deletes an Endpoint
 *     summary: Delete an Endpoint in the DB
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
 *             endpoint:
 *               type: string
 *               description: REST endpoint to which the permission is assigned.
 *             method:
 *               type: string
 *               description: HTTP method
 *           required:
 *             - endpoint
 *             - method
 *     responses:
 *       '200':
 *         description: Endpoint Deleted successfully.
 *       '400':
 *         description: Endpoint doesn't exist.
 *       '401':
 *         description: Parameter validation failed.
 */

router.post('/deleteEndpoint', async (req, res) => {
  // Validate weather the request body contains all the parameters or not
  var bodyParameterValidationResult = validateBodyParamsExistence(req, ['endpoint', 'method']);
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
    // If Endpoint exists
    const endpointExists = await Endpoint.findOne({ where: {
        endpoint: req.body.endpoint ,
        method: req.body.method
    }
    });
    logger.debug(`[ DELETE ENDPOINT ] Details -- Endpoint: ${req.body.endpoint}, Method: ${req.body.method}`);
    if (endpointExists){
        await endpointExists.destroy();
        return res.status(200).send({
            statusCode: 200,
            message: `Deleted Endpoint successfully. Details -- Endpoint: ${endpointExists.endpoint}, Method: ${endpointExists.method}`,
        });
    }
    else{
        logger.debug(`[ DELETE ENDPOINT ] Failed to delete endpoint. Endpoint Doesn't exist`);
        return res.status(400).send({
            statusCode: 400,
            message: `Failed to delete endpoint. Endpoint Doesn't exist. Details -- Endpoint: ${endpointExists.endpoint}, Method: ${endpointExists.method}`,
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


/**
 * @swagger
 * /deleteEndpointById/{endpointId}:
 *   delete:
 *     tags:
 *       - Endpoint
 *     name: Deletes an Endpoint (Using Endpoint ID)
 *     summary: Delete an Endpoint in the DB
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: endpointId
 *         schema:
 *           type: UUID
 *         description: ID of the Endpoint
 *         required: true
 *     responses:
 *       '200':
 *         description: Endpoint Deleted successfully.
 *       '400':
 *         description: Endpoint doesn't exist.
 *       '401':
 *         description: Parameter validation failed.
 */

 router.delete('/deleteEndpointById/:endpointId', async (req, res) => {
  try{
    // If Endpoint exists
    const endpointExists = await Endpoint.findOne({ where: {
      id: req.params.endpointId
    }
    });
    logger.debug(`[ DELETE ENDPOINT BY ID ] Details -- Endpoint: ${endpointExists.endpoint}, Method: ${endpointExists.method}`);
    if (endpointExists){
        await endpointExists.destroy();
        return res.status(200).send({
            statusCode: 200,
            message: `Deleted Endpoint successfully. Details -- ID: ${endpointExists.id}, Endpoint: ${endpointExists.endpoint}, Method: ${endpointExists.method}`,
        });
    }
    else{
        logger.debug(`[ DELETE ENDPOINT ] Failed to delete endpoint. Endpoint Doesn't exist`);
        return res.status(400).send({
            statusCode: 400,
            message: `Failed to delete endpoint. Endpoint Doesn't exist. Details -- ID: ${req.params.endpointId}`,
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