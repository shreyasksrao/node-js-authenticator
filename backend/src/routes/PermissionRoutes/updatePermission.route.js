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
 * /updatePermission/{permission_id}:
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
 *         name: permission_id
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
 *             endpoint_id:
 *               type: uuid
 *               description: ID of the endpoint created in the DB
 *             permission_type:
 *               type: string
 *               description: Permission type (Allowed values are - "Allow" or "Deny")
 *             description:
 *               type: string
 *               description: Description about the permission.
 *           required:
 *             - description
 *             - endpoint_id
 *             - name
 *             - permission_type
 *     responses:
 *       '202':
 *         description: Permission updated successfully.
 *       '400':
 *         description: Permission doesn't exists.
 *       '401':
 *         description: Parameter validation failed.
 */

router.put('/updatePermission/:permission_id', async (req, res) => {
  // Validate weather the request body contains all the parameters or not
  var bodyParameterValidationResult = validateBodyParamsExistence(req, ['description', 'endpoint_id', 'name', 'permission_type']);
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
            id: req.params.permission_id
        }
    });
    logger.debug(`[ UPDATE PERMISSION ] Details -- Permission name: ${req.body.name}, Endpoint ID: ${req.body.endpoint_id}`);
    if (permissionExists){
        permissionExists.name = req.body.name;
        permissionExists.endpoint_id = req.body.endpoint_id;
        permissionExists.description = req.body.description;
        permissionExists.permission_type = req.body.permission_type;
        await permissionExists.save();
        logger.debug(`[ UPDATE PERMISSION ] Successfully updated Permission. Details -- Permission name: ${req.body.name}, Endpoint ID: ${req.body.endpoint_id}, Permission type: ${req.body.permission_type}`);
        return res.status(202).json({
        statusCode: 202,
        message: `Permission Updated Successfully. Details -- Permission name: ${req.body.name}, Endpoint ID: ${req.body.endpoint_id}, Permission type: ${req.body.permission_type}`
        });
    }
    else {
        logger.error(`[ UPDATE PERMISSION ] Failed updated permission. Details -- Permission with ID ${req.params.permission_id} doesn't exist`);
        return res.status(400).json({
        statusCode: 400,
        message: `Failed updated Permission. Details -- Permission with ID ${req.params.permission_id} doesn't exist`
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