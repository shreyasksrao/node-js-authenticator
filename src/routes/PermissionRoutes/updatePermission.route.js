/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Permission } = require('../../sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');
const { validateBodyParamsExistence } = require('../../utils/validateBodyParameters');
const { VALID_METHODS, httpMethodsValidator } = require('../../validators/httpMethodsValidator');
/**
 * @swagger
 * /updatePermission/{permissionId}:
 *   put:
 *     tags:
 *       - Permission
 *     name: Updates a Permission
 *     summary: Update an existing Permission in the DB
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: uuid
 *         description: Permission ID
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Unique name given to a permission (Ex - <Permission type> <Resource name like URL>)
 *             endpointId:
 *               type: uuid
 *               description: ID of the endpoint created in the DB
 *             permissionType:
 *               type: string
 *               description: Permission type (Allowed values are - "Allow" or "Deny")
 *             description:
 *               type: string
 *               description: Description about the permission.
 *           required:
 *             - description
 *             - endpointId
 *             - name
 *             - permissionType
 *     responses:
 *       '202':
 *         description: Permission updated successfully.
 *       '400':
 *         description: Permission doesn't exists.
 *       '401':
 *         description: Parameter validation failed.
 */

router.put('/updatePermission/:permissionId', async (req, res) => {
  // Validate weather the request body contains all the parameters or not
  var bodyParameterValidationResult = validateBodyParamsExistence(req, ['description', 'endpointId', 'name', 'permissionType']);
  if (bodyParameterValidationResult.status == false){
    logger.debug(`Body parameter validation error: ${bodyParameterValidationResult.message}`);
    return res.status(401).send({
      statusCode: 401,
      message: bodyParameterValidationResult.message
    });
  }
  logger.debug(`Validated body parameters successfully...`);

  try{
    // If Permission exists then only Update
    const permissionExists = await Permission.findOne({ where: {
            id: req.params.permissionId
        }
    });
    logger.debug(`[ UPDATE PERMISSION ] Details -- Permission name: ${req.body.name}, Endpoint ID: ${req.body.endpointId}`);
    if (permissionExists){
        permissionExists.name = req.body.name;
        permissionExists.endpointId = req.body.endpointId;
        permissionExists.description = req.body.description;
        permissionExists.permissionType = req.body.permissionType;
        await permissionExists.save();
        logger.debug(`[ UPDATE PERMISSION ] Successfully updated Permission. Details -- Permission name: ${req.body.name}, Endpoint ID: ${req.body.endpointId}, Permission type: ${req.body.permissionType}`);
        return res.status(202).json({
        statusCode: 202,
        message: `Permission Updated Successfully. Details -- Permission name: ${req.body.name}, Endpoint ID: ${req.body.endpointId}, Permission type: ${req.body.permissionType}`
        });
    }
    else {
        logger.error(`[ UPDATE PERMISSION ] Failed updated permission. Details -- Permission with ID ${req.params.permissionId} doesn't exist`);
        return res.status(400).json({
        statusCode: 400,
        message: `Failed updated Permission. Details -- Permission with ID ${req.params.permissionId} doesn't exist`
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