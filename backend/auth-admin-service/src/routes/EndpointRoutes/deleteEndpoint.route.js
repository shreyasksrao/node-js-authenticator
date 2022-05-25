/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Endpoint } = require('../../sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');

let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');
const { authenticateTokenUsingService } = require('../../middlewares/authenticateTokenUsingService');
const { roleValidationUsingService } = require('../../middlewares/roleValidationUsingService');
/**
 * @swagger
 * /deleteEndpoint/{endpoint_name}:
 *   delete:
 *     tags:
 *       - Endpoint
 *     name: Deletes an Endpoint
 *     summary: Delete an Endpoint in the DB
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: endpoint_name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Endpoint name.
 *     responses:
 *       '200':
 *         description: Endpoint Deleted successfully.
 *       '400':
 *         description: Endpoint doesn't exist.
 *       '401':
 *         description: Parameter validation failed.
 */

router.delete('/deleteEndpoint/:endpoint_name', 
              addEndpointNameToRequest('delete_endpoint_by_passing_endpoint_name'), 
              authenticateTokenUsingService,
              roleValidationUsingService,
              async (req, res) => {
                try{
                  // If Endpoint exists
                  const endpointExists = await Endpoint.findOne({ where: {
                      name: req.params.endpoint_name
                  }
                  });
                  logger.debug(`[ DELETE ENDPOINT ] Details -- Endpoint Name: ${req.params.endpoint_name}`);
                  if (endpointExists){
                      await endpointExists.destroy();
                      return res.status(200).send({
                          statusCode: 200,
                          message: `Deleted Endpoint successfully. Details -- Endpoint Name: ${req.params.endpoint_name}`,
                      });
                  }
                  else{
                      logger.debug(`[ DELETE ENDPOINT ] Failed to delete endpoint. Endpoint Doesn't exist`);
                      return res.status(400).send({
                          statusCode: 400,
                          message: `Failed to delete endpoint. Endpoint Doesn't exist. Details -- Endpoint Name: ${req.params.endpoint_name}`,
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
 * /deleteEndpointById/{endpoint_id}:
 *   delete:
 *     tags:
 *       - Endpoint
 *     name: Deletes an Endpoint (Using Endpoint ID)
 *     summary: Delete an Endpoint in the DB
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: endpoint_id
 *         schema:
 *           type: uuid
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

 router.delete('/deleteEndpointById/:endpoint_id', 
               addEndpointNameToRequest('delete_endpoint_by_passing_endpoint_id'),
               authenticateTokenUsingService,
               roleValidationUsingService, 
               async (req, res) => {
                try{
                  // If Endpoint exists
                  const endpointExists = await Endpoint.findOne({ where: {
                    id: req.params.endpoint_id
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
                          message: `Failed to delete endpoint. Endpoint Doesn't exist. Details -- ID: ${req.params.endpoint_id}`,
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