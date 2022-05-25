/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Permission } = require('../../sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');
const { validateBodyParamsExistence } = require('../../utils/validateBodyParameters');

let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');
const { authenticateTokenUsingService } = require('../../middlewares/authenticateTokenUsingService');
const { roleValidationUsingService } = require('../../middlewares/roleValidationUsingService');
/**
 * @swagger
 * /createPermission:
 *   post:
 *     tags:
 *       - Permission
 *     name: Create Permission
 *     summary: Create a new Permission for Role
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
 *               description: Unique name given to a permission (Ex - <Permission type> <Resource name like URL>)
 *               required: true
 *             description:
 *               type: string
 *               description: Description about the permission.
 *             endpoint_id:
 *               type: UUID
 *               description: ID of the endpoint created in the DB 
 *             permission_type:
 *               type: string
 *               description: Permission type (Allowed values are - "Allow" or "Deny")
 *           required:
 *             - name
 *             - description
 *             - endpoint_id
 *             - permission_type
 *     responses:
 *       '201':
 *         description: Permission created successfully.
 *       '400':
 *         description: Bad Request ! Permission already exists.
 *       '401':
 *         description: Body Parameters validation failed.
 */

router.post('/createPermission', 
            addEndpointNameToRequest('create_permission'), 
            authenticateTokenUsingService,
            roleValidationUsingService,
            async (req, res) => {
              // Validate weather the request body contains all the parameters or not
              var bodyParameterValidationResult = validateBodyParamsExistence(req, ['name', 'description', 'endpoint_id', 'permission_type']);
              if (bodyParameterValidationResult.status == false){
                logger.debug(`Body parameter validation error: ${bodyParameterValidationResult.message}`);
                return res.status(401).send({
                  statusCode: 401,
                  message: bodyParameterValidationResult.message
                });
              }
              logger.debug(`Validated body parameters successfully...`);

              // If User exists, then throw the Error
              const permissionExists = await Permission.findOne({ where: {
                  endpoint_id: req.body.endpoint_id ,
                  permission_type: req.body.permission_type
                }
              });
              if (permissionExists){
                logger.info(`Permission already exists !!`);
                logger.debug(`Permission details -- Name: ${req.body.name}, EndpointId: ${req.body.endpoint_id}`);
                return res.status(400).send({
                  statusCode: 400,
                  message: 'Bad request !! - Permission already exists',
                });
              }

              // Create a Permission in the DB
              try {
                logger.debug(`Creating a Permission -- Name: ${req.body.name}, Endpoint ID: ${req.body.endpoint_id}`);
                const savedPermission = await Permission.create({
                  name:req.body.name,
                  description: req.body.description,
                  endpoint_id: req.body.endpoint_id,
                  permission_type: req.body.permission_type
                });
                logger.info(`Permission created and saved in the DB -- ID: ${savedPermission.id}, Endpoint ID: ${savedPermission.endpoint_id}, Type: ${savedPermission.permission_type}`);
                return res.status(201).send({
                  statusCode: 201,
                  message: `Permission has been created. ID: ${savedPermission.id}, Endpoint ID: ${savedPermission.endpoint_id}, Type: ${savedPermission.permission_type}`,
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