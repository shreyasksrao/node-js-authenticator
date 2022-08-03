/* eslint-disable no-console */
/*jshint esversion: 8 */
const {User} = require('../../sequelize');
const { authenticateTokenUsingService } = require('../../middlewares/authenticateTokenUsingService');
const { roleValidationUsingService } = require('../../middlewares/roleValidationUsingService');
const router = require('express').Router();
let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');

/**
 * @swagger
 * /resetPasswordEmail:
 *   put:
 *     tags:
 *       - Users
 *     name: Send email to Reset Password of the User with link in it
 *     summary: Send email for password reset
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: "The Email ID of the User"
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       '200':
 *         description: Reset Password link sent successfully
 *       '403':
 *         description: No authorization / Email not found
 */

router.put('/resetPasswordEmail', 
            addEndpointNameToRequest('reset_password_email'), 
            authenticateTokenUsingService,
            roleValidationUsingService,
            async (req, res, next) => { 
              let user = await User.findOne({ where: { email: req.body.email }});
              
              if(user === null){
                res.status(401).json({
                    statusCode: 401,
                    message: `User with Email address ${req.body.email} doesn't exist !!`
                });
              }
              else{
                
              }
});


module.exports=router;