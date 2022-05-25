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
 * /createRole:
 *   post:
 *     tags:
 *       - Role
 *     name: Create a Role
 *     summary: Create a new Role
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
 *               type: JSON
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

router.post('/createRole', 
            addEndpointNameToRequest('create_role'), 
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
              logger.debug(`Validated body parameters successfully...`);

              // If Role exists, then throw the Error
              const roleExists = await Role.findOne({ where: {
                  name: req.body.name
                }
              });
              if (roleExists){
                logger.info(`Role already exists !!`);
                logger.debug(`Role details -- Name: ${req.body.name}, Permission: ${JSON.stringify(req.body.permissions)}`);
                return res.status(400).send({
                  statusCode: 400,
                  message: 'Bad request !! - Role already exists',
                });
              }

              // Create a Role in the DB
              try {
                logger.debug(`Creating a Role -- Name: ${req.body.name}, Permission: ${JSON.stringify(req.body.permissions)}`);
                const savedRole = await Role.create({
                  name:req.body.name,
                  description: req.body.description,
                  permissions: req.body.permissions
                });
                logger.info(`Role created and saved in the DB -- ID: ${savedRole.id}, Permissions: ${savedRole.permissions}`);
                return res.status(201).send({
                  statusCode: 201,
                  message: `Role has been created. ID: ${savedRole.id}, Permissions: ${savedRole.permissions}`,
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


module.exports=router;