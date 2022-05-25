/* eslint-disable no-console */
/*jshint esversion: 8 */
const {User} = require('../../sequelize');
const { authenticateTokenUsingService } = require('../../middlewares/authenticateTokenUsingService');
const { roleValidationUsingService } = require('../../middlewares/roleValidationUsingService');
const router = require('express').Router();
let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');
const { loggers } = require('winston');

const VALID_USER_STATES = ['active', 'inactive'];

/**
 * @swagger
 * /changeUserState:
 *   put:
 *     tags:
 *       - Users
 *     name: Change the User state
 *     summary: Update user state from active --> inactive or vice-versa
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Email ID of the User whose state has to be updated
 *             status:
 *               type: string
 *               description: Value of the latest User state. Supported values [active, inactive]
 *         required:
 *           - status
 *           - email
 *     responses:
 *       '200':
 *         description: User State updated successfully
 *       '403':
 *         description: No authorization / user not found
 */

router.put('/changeUserState', 
            addEndpointNameToRequest('change_user_state'), 
            authenticateTokenUsingService ,
            roleValidationUsingService,
            async (req, res, next) => {  
                try {
                    let userInfo = await User.findOne({ where: { email: req.body.email } });
                    if (userInfo != null) {
                        const currentStatus = userInfo.status;
                        if (VALID_USER_STATES.includes(req.body.status)){
                            userInfo.status = req.body.status;
                            console.log(`User Status Updated Successfully. Old Value - ${currentStatus}, New Value - ${req.body.status}`);
                            userInfo.save();
                            res.status(200).json({ 
                                status: 200, 
                                message: `User Status Updated Successfully. Old Value - ${currentStatus}, New Value - ${req.body.status}`
                            });
                        }
                        else{
                            console.log(`User Status Update failed !! Invalid Parameter`);
                            res.status(401).json({ 
                                status: 401,
                                message: `Invalid User State passed to the request body ! Supported values are ${JSON.stringify(VALID_USER_STATES)}` 
                            });
                        }
                        
                    } else {
                        console.error(`User doesn't exist in the DB with Email: ${req.body.email}`);
                        res.status(401).json({
                            status: 401,
                            message: `User doesn't exist in the DB with Email: ${req.body.email}`
                        });
                    } 
                } catch (err) {
                    return res.status(500).send({
                        statusCode: 500,
                        message: 'Internal Server Error !!!',
                        devMessage: err.message,
                        stackTrace: err.stack
                    });
                }
                
            });


module.exports=router;