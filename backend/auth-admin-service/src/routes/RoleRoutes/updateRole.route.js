/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Role } = require('../../sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');
const { validateBodyParamsExistence } = require('../../utils/validateBodyParameters');
let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');
const { authenticateTokenUsingService } = require('../../middlewares/authenticateTokenUsingService');
const { roleValidationUsingService } = require('../../middlewares/roleValidationUsingService');

/**
 * @swagger
 * /updateRole:
 *   put:
 *     tags:
 *       - Role
 *     name: Update a Role
 *     summary: Update a Role
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               description: Unique name given to a role (Ex - User, Moderator, Admin, SuperAdmin)
 *               required: true
 *             description:
 *               type: string
 *               description: Description about the Role.
 *             permissions:
 *               type: object
 *               description: Permission array (JSON string). Value should be an array of Permission IDs with "permissions" as Key
 *           required:
 *             - name
 *             - description
 *             - permissions
 *     responses:
 *       '201':
 *         description: Role created successfully.
 *       '400':
 *         description: Bad Request ! Permission already exists.
 *       '401':
 *         description: Body Parameters validation failed.
 */

router.put('/updateRole', 
            addEndpointNameToRequest('update_role'), 
            authenticateTokenUsingService,
            roleValidationUsingService,
            async (req, res) => {
              // Validate weather the request body contains all the parameters or not
              var bodyParameterValidationResult = validateBodyParamsExistence(req, ['name', 'description', 'permissions']);
              if (bodyParameterValidationResult.status == false){
                logger.debug(`Body parameter validation error: ${bodyParameterValidationResult.message}`);
                return res.status(401).send({
                  statusCode: 401,
                  message: bodyParameterValidationResult.message
                });
              }
              try {
                  // If Role exists, then throw the Error
                const roleExists = await Role.findOne({ where: { name: req.body.name }});
                if (roleExists){
                    logger.debug(`Updating Role ${req.body.name}...`);
                    logger.debug(`Updated Role details -- Name: ${req.body.name}, Permission: ${JSON.stringify(req.body.permissions)}`);
                    roleExists.description = req.body.description;
                    roleExists.permissions = req.body.permissions;
                    await roleExists.save();
                    return res.status(201).send({
                        statusCode: 201,
                        message: `Role Updated. ID: ${roleExists.id}, Permissions: ${roleExists.permissions}`,
                      });
                }
                else
                return res.status(400).send({
                    statusCode: 400,
                    message: `Bad request !! - Role Doesn't exist. Details: Name - ${req.body.name}`,
                });
              } catch (error) {
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