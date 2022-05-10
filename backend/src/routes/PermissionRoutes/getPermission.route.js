/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Permission } = require('../../sequelize');
const sequelize = require('sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');
let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');
/**
 * @swagger
 * /getAllPermissions:
 *   get:
 *     tags:
 *       - Permission
 *     name: Get Permission/s
 *     summary: Get all the Permissions.
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Permissions fetched successfully.
 *       '400':
 *         description: Bad Request.
 *       '500':
 *         description: Internal Server error.
 *       '403':
 *         description: Username or email already taken.
 */

router.get('/getAllPermissions', addEndpointNameToRequest('get_all_permissions'), async (req, res) => {
  try{    
    // TODO : Implement Caching ...
    let permissionArray = await Permission.findAll({});
    return res.status(200).json({
        statusCode: 200,
        message: `Permissions fetched successfully`,
        permissions: permissionArray
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
 * /getPermissions/{key}/{key_hint}:
 *   get:
 *     tags:
 *       - Permission
 *     name: Get Permissions by passing Permission hint (Name, Permission type)
 *     summary: Get Permissions by passing hint about the Permission name or Type
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         description: Hint key (One of ["name", "permission_type"] )
 *         required: true
 *       - in: path
 *         name: key_hint
 *         schema:
 *           type: string
 *         description: Hint value for the KEY
 *     responses:
 *       '200':
 *         description: Permissions fetched successfully.
 *       '400':
 *         description: Permission doesn't exist.
 *       '401':
 *         description: Parameter validation failed.
 */

 router.get('/getPermissions/:key/:key_hint', addEndpointNameToRequest('get_permissions_by_hint'), async (req, res) => {
  try{
    let column = req.params.key.toLowerCase();
    let value = req.params.key_hint.toLowerCase();
    
    logger.debug(`[ GET PERMISSIONS BY HINT ] Details -- Hint key: ${column}, Hint value: ${value}`);

    // If the Hint is for the "name" column
    if (column == 'name'){
      let permissions = await Permission.findAll({ 
        where: {
            name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + value + '%')
        }
      });
      return res.status(201).json({
        statusCode: 201,
        message: `Permissions fetched successfully. Details -- Hint Key: ${column}, Hint Value: ${value}`,
        endpoints: JSON.stringify(permissions)
      });
    }

    // If the Hint is for the "permissionType" column
    else if(column == 'permission_type'){
      let permissions = await Permission.findAll({ 
        where: {
            permissionType: sequelize.where(sequelize.fn('LOWER', sequelize.col('permission_type')), 'LIKE', '%' + value + '%')
        }
      });
      return res.status(201).json({
        statusCode: 201,
        message: `Permissions fetched successfully. Details -- Hint Key: ${column}, Hint Value: ${value}`,
        endpoints: JSON.stringify(permissions)
      });
    }

    // Else, throw the error saying invalid hint key
    else{
        logger.debug(`[ GET ENDPOINTS BY HINT ] Failed to fetch endpoints. Hint key is invalid. Valid Hint keys are ["name", "permission_type"]`);
        return res.status(400).json({
            statusCode: 400,
            message: `Failed to fetch endpoints. Hint key is invalid. Valid Hint keys are ["name", "permission_type"]`,
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