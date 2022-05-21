/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Permission } = require('../../sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');
const { validateBodyParamsExistence } = require('../../utils/validateBodyParameters');

let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');
const authenticateToken = require('../../middlewares/authenticateToken');
const { validateRole } = require('../../middlewares/roleValidation');
/**
 * @swagger
 * /deletePermission/{permission_id}:
 *   delete:
 *     tags:
 *       - Permission
 *     name: Deletes a Permission (Using Permission ID)
 *     summary: Delete a Permission in the DB
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: permission_id
 *         schema:
 *           type: uuid
 *         description: ID of the Permission
 *         required: true
 *     responses:
 *       '200':
 *         description: Permission Deleted successfully.
 *       '400':
 *         description: Permission doesn't exist.
 *       '401':
 *         description: Parameter validation failed.
 */

 router.delete('/deletePermission/:permission_id', 
               addEndpointNameToRequest('delete_permission_by_passing_id'), 
               authenticateToken,
               validateRole,
               async (req, res) => {
                try{
                  // If Permission exists
                  const permissionExists = await Permission.findOne({ where: {
                    id: req.params.permission_id
                  }
                  });
                  logger.debug(`[ DELETE PERMISSION ] Details -- Name: ${permissionExists.name}, Endpoint ID: ${permissionExists.endpoint_id}, Permission Type: ${permissionExists.permission_type}`);
                  if (permissionExists){
                      await permissionExists.destroy();
                      return res.status(200).send({
                          statusCode: 200,
                          message: `Deleted Permission successfully. Details -- Name: ${permissionExists.name}, Endpoint ID: ${permissionExists.endpoint_id}, Permission Type: ${permissionExists.permission_type}}`,
                      });
                  }
                  else{
                      logger.debug(`[ DELETE PERMISSION ] Failed to delete Permission. Permission Doesn't exist`);
                      return res.status(400).send({
                          statusCode: 400,
                          message: `Failed to delete permission. Permission Doesn't exist. Details -- ID: ${req.params.permission_id}`,
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