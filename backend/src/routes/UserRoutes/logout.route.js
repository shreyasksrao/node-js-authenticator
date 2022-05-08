/*jshint esversion: 8 */
/* eslint-disable no-console */

/**
 * @swagger
 * /logoutUser:
 *   post:
 *     tags:
 *       - Users
 *     name: Log-out a User
 *     summary: Logs out a user
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     responses:
 *       '200':
 *         description: User logged-out successfully
 *       '401':
 *         description: Token not passed in the Auth header
 *       '403':
 *         description: Invalid token (Either Expired or already blacklisted token...)
 */

const router = require("express").Router();
const { blacklistToken } = require('../../middlewares/blacklistToken');
let addEndpointNameToRequest = require('../../middlewares/addEndpointNameToRequest');

router.post('/logoutUser', addEndpointNameToRequest('logout_user'), blacklistToken);
 
module.exports = router;