/*jshint esversion: 8 */
/* eslint-disable no-console */

/**
 * @swagger
 * /logout:
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
 *         description: Bad username, not found in db
 *       '403':
 *         description: Username and password don't match
 */

const router = require("express").Router();
const { blacklistToken } = require('../middlewares/blacklistToken');

router.post('/logout', blacklistToken);
 
module.exports = router;