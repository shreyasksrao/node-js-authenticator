/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Endpoint } = require('../../sequelize');
const router = require("express").Router();
const sequelize = require('sequelize');

// Load the Winston logger
const logger = require('../../winston.conf.js');

/**
 * @swagger
 * /getAllEndpoints:
 *   get:
 *     tags:
 *       - Endpoint
 *     name: Get all Endpoints
 *     summary: Get all Endpoints in the DB
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Endpoint fetched successfully.
 *       '400':
 *         description: Endpoint doesn't exist.
 */

router.get('/getAllEndpoints', async (req, res) => {
   try{
    const allEndpoints = await Endpoint.findOne({});
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
 * /getEndpoints/{endpointHint}:
 *   get:
 *     tags:
 *       - Endpoint
 *     name: Get Endpoints by passing Endpoint hint (Using Endpoint name)
 *     summary: Get Endpoints in the DB
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: endpointHint
 *         schema:
 *           type: string
 *         description: Hint about the endpoint
 *         required: true
 *     responses:
 *       '200':
 *         description: Endpoint fetched successfully.
 *       '400':
 *         description: Endpoint doesn't exist.
 *       '401':
 *         description: Parameter validation failed.
 */

 router.get('/getEndpoints/:endpointHint', async (req, res) => {
  try{
    let lookupValue = req.params.endpointHint.toLowerCase();
    // If Endpoint exists
    const endpoints = await Endpoint.findAll({ 
        where: {
            endpoint: sequelize.where(sequelize.fn('LOWER', sequelize.col('endpoint')), 'LIKE', '%' + lookupValue + '%')
        }
    });
    logger.debug(`[ GET ENDPOINTS BY HINT ] Details -- Hint: ${lookupValue}`);
    if (endpoints){
        return res.status(200).json({
            statusCode: 200,
            message: `Endpoints fetched successfully. Details -- Hint: ${lookupValue}`,
            endpoints: JSON.stringify(endpoints)
        });
    }
    else{
        logger.debug(`[ GET ENDPOINTS BY HINT ] Failed to fetch endpoints. Endpoints Doesn't exist`);
        return res.status(400).json({
            statusCode: 400,
            message: `Failed to fetch endpoints. Endpoints Doesn't exist. Details -- Hint: ${lookupValue}`,
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