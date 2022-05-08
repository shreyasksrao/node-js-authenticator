/* eslint-disable no-console */
/*jshint esversion: 8 */
const {User} = require('../../sequelize');
const authenticateToken = require('../../middlewares/authenticateToken');
const router = require('express').Router();
let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');

/**
 * @swagger
 * /updateUser:
 *   put:
 *     tags:
 *       - Users
 *     name: Update User
 *     summary: Update user info
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
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             email:
 *               type: string
 *             username:
 *               type: string
 *         required:
 *           - username
 *     responses:
 *       '200':
 *         description: User info updated
 *       '403':
 *         description: No authorization / user not found
 */

router.put('/updateUser', addEndpointNameToRequest('update_user'), authenticateToken ,(req, res, next) => {  
        User.findOne({
          where: {
            username: req.body.username,
          },
        }).then((userInfo) => {
          if (userInfo != null) {
            console.log('user found in db');
            userInfo
              .update({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
              })
              .then(() => {
                console.log('user updated');
                res.status(200).send({ auth: true, message: 'user updated' });
              });
          } else {
            console.error('no user exists in db to update');
            res.status(401).send('no user exists in db to update');
          }
        });    
  });


module.exports=router;