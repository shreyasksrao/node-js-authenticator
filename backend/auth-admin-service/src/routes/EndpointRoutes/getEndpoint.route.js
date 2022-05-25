/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Endpoint } = require('../../sequelize');
const router = require("express").Router();
const sequelize = require('sequelize');

// Load the Winston logger
const logger = require('../../winston.conf.js');
let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');
const { authenticateTokenUsingService } = require('../../middlewares/authenticateTokenUsingService');
const { roleValidationUsingService } = require('../../middlewares/roleValidationUsingService');

/**
 * @swagger
 * /getAllEndpoints:
 *   get:
 *     tags:
 *       - Endpoint
 *     name: Get all Endpoints
 *     summary: Get all Endpoints in the DB
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Endpoint fetched successfully.
 *       '400':
 *         description: Endpoint doesn't exist.
 */

router.get('/getAllEndpoints', 
            addEndpointNameToRequest('get_all_endpoints'), 
            authenticateTokenUsingService, 
            roleValidationUsingService, 
            async (req, res) => {
                try{
                    const allEndpoints = await Endpoint.findAll({});
                    logger.debug(`[ GET ALL ENDPOINTS ]`);
                    if (allEndpoints){
                        return res.status(200).json({
                            statusCode: 200,
                            message: `Endpoints fetched successfully.`,
                            endpoints: JSON.stringify(allEndpoints)
                        });
                    }
                    else{
                        logger.debug(`[ GET ALL ENDPOINT ] Failed to fetch endpoints. Empty array`);
                        return res.status(400).json({
                            statusCode: 400,
                            message: `Failed to fetch endpoints. No endpoints exist`,
                            endpoints: JSON.stringify(allEndpoints)
                        });
                    }
                }
                catch (err) {
                    logger.error(err);
                    return res.status(500).json({
                        statusCode: 500,
                        message: 'Internal Server Error !!!',
                        devMessage: err.message,
                        stackTrace: err.stack
                    });
                }
});


/**
 * @swagger
 * /getEndpoints/{endpointHintColumn}/{endpointHintValue}:
 *   get:
 *     tags:
 *       - Endpoint
 *     name: Get Endpoints by passing Endpoint hint (Using Endpoint name)
 *     summary: Get Endpoints in the DB
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: endpointHintColumn
 *         schema:
 *           type: string
 *         description: Hint about the endpoint
 *         required: true
 *       - in: path
 *         name: endpointHintValue
 *         schema:
 *           type: string
 *         description: Hint value about the endpoint
 *         required: true
 *     responses:
 *       '200':
 *         description: Endpoint fetched successfully.
 *       '400':
 *         description: Endpoint doesn't exist.
 *       '401':
 *         description: Parameter validation failed.
 */

 router.get('/getEndpoints/:endpointHintColumn/:endpointHintValue',
            addEndpointNameToRequest('get_endpoints_by_hint'), 
            authenticateTokenUsingService, 
            roleValidationUsingService, 
            async (req, res) => {
                try{
                    let lookupKey = req.params.endpointHintColumn.toLowerCase();
                    let lookupValue = req.params.endpointHintValue.toLowerCase();

                    logger.debug(`[ GET ENDPOINTS BY HINT ] Details -- Hint key: ${lookupKey}, Hint value: ${lookupValue}`);

                    if(lookupKey == "name"){
                        const endpoints = await Endpoint.findAll({ 
                            where: {
                                name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%')
                            }
                        });
                        return res.status(200).json({
                            statusCode: 200,
                            message: `Endpoints fetched successfully. Details -- Hint key: ${lookupKey}, Hint value: ${lookupValue}`,
                            endpoints: JSON.stringify(endpoints)
                        });
                    }
                    else if (lookupKey == "endpoint"){
                        const endpoints = await Endpoint.findAll({ 
                            where: {
                                endpoint: sequelize.where(sequelize.fn('LOWER', sequelize.col('endpoint')), 'LIKE', '%' + lookupValue + '%')
                            }
                        });
                        return res.status(200).json({
                            statusCode: 200,
                            message: `Endpoints fetched successfully. Details -- Hint key: ${lookupKey}, Hint value: ${lookupValue}`,
                            endpoints: JSON.stringify(endpoints)
                        });
                    }
                    else{
                        logger.debug(`[ GET ENDPOINTS BY HINT ] Failed to fetch endpoints. Endpoints Doesn't exist`);
                        return res.status(400).json({
                            statusCode: 400,
                            message: `Invalid Endpoint Hint Key. Valid keys are ["name", "endpoint"]`,
                        });
                    }
                }
                catch (err) {
                    logger.error(err);
                    return res.status(500).json({
                        statusCode: 500,
                        message: 'Internal Server Error !!!',
                        devMessage: err.message,
                        stackTrace: err.stack
                    });
                }
});


module.exports=router;