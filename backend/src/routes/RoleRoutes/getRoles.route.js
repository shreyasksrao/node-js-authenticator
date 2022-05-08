/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Role } = require('../../sequelize');
const sequelize = require('sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');
/**
 * @swagger
 * /getAllRoles:
 *   get:
 *     tags:
 *       - Role
 *     name: Get Role/s
 *     summary: Get all the Roles.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Roles fetched successfully.
 *       '400':
 *         description: Bad Request.
 *       '500':
 *         description: Internal Server error.
 */

router.get('/getAllRoles', async (req, res) => {
  try{    
    // TODO : Implement Caching ...
    let roleArray = await Role.findAll({});
    return res.status(200).json({
        statusCode: 200,
        message: `Roles fetched successfully`,
        roles: roleArray
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

/**
 * @swagger
 * /getRoles/{key}/{key_hint}:
 *   get:
 *     tags:
 *       - Role
 *     name: Get Roles by passing Role hint (Name)
 *     summary: Get Roles by passing hint about the Role name or Type
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         description: Hint key (One of ["name"] )
 *         required: true
 *       - in: path
 *         name: key_hint
 *         schema:
 *           type: string
 *         description: Hint value for the KEY
 *     responses:
 *       '200':
 *         description: Roles fetched successfully.
 *       '400':
 *         description: Role doesn't exist.
 *       '401':
 *         description: Parameter validation failed.
 */

 router.get('/getRoles/:key/:key_hint', async (req, res) => {
  try{
    let column = req.params.key.toLowerCase();
    let value = req.params.key_hint.toLowerCase();
    
    logger.debug(`[ GET ROLES BY HINT ] Details -- Hint key: ${column}, Hint value: ${value}`);

    // If the Hint is for the "name" column
    if (column == 'name'){
      let roles = await Role.findAll({ 
        where: {
            name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + value + '%')
        }
      });
      return res.status(201).json({
        statusCode: 201,
        message: `Roles fetched successfully. Details -- Hint Key: ${column}, Hint Value: ${value}`,
        roles: JSON.stringify(roles)
      });
    }

    // Else, throw the error saying invalid hint key
    else{
        logger.debug(`[ GET ROLES BY HINT ] Failed to fetch roles. Hint key is invalid. Valid Hint keys are ["name"]`);
        return res.status(400).json({
            statusCode: 400,
            message: `Failed to fetch roles. Hint key is invalid. Valid Hint keys are ["name"]`,
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