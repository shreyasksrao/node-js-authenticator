/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Role } = require('../../sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');

let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');
const { authenticateTokenUsingService } = require('../../middlewares/authenticateTokenUsingService');
const { roleValidationUsingService } = require('../../middlewares/roleValidationUsingService');
/**
 * @swagger
 * /deleteRole/{role_id}:
 *   delete:
 *     tags:
 *       - Role
 *     name: Deletes a Role (Using Role ID)
 *     summary: Delete a Role in the DB
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role_id
 *         schema:
 *           type: uuid
 *         description: ID of the Role
 *         required: true
 *     responses:
 *       '200':
 *         description: Role Deleted successfully.
 *       '400':
 *         description: Role doesn't exist.
 *       '401':
 *         description: Parameter validation failed.
 */

 router.delete('/deleteRole/:role_id', 
               addEndpointNameToRequest('delete_role_by_passing_id'), 
               authenticateTokenUsingService,
               roleValidationUsingService,
               async (req, res) => {
                try{
                  // If Role exists
                  const roleExists = await Role.findOne({ where: {
                    id: req.params.role_id
                  }
                  });
                  logger.debug(`[ DELETE ROLE ] Details -- Name: ${roleExists.name}, Role ID: ${roleExists.id}, Role Name: ${roleExists.name}`);
                  if (roleExists){
                      await roleExists.destroy();
                      return res.status(200).send({
                          statusCode: 200,
                          message: `Deleted Role successfully. Details -- Name: ${roleExists.name}, Role ID: ${roleExists.id}`,
                      });
                  }
                  else{
                      logger.debug(`[ DELETE ROLE ] Failed to delete Role. Role Doesn't exist`);
                      return res.status(400).send({
                          statusCode: 400,
                          message: `Failed to delete role. Role Doesn't exist. Details -- ID: ${req.params.id}`,
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