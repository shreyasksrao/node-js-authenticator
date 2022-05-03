/* eslint-disable no-console */
/*jshint esversion: 8 */
const {User} = require('../sequelize');
const authenticateToken = require('../middlewares/authenticateToken');
const router = require('express').Router();

/**
 * @swagger
 * /findUserByUsername:
 *   get:
 *     tags:
 *       - Users
 *     name: Find user by Username
 *     summary: Finds a user by Username
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required:
 *           - username
 *     responses:
 *       '200':
 *         description: A single user object
 *         schema:
 *           $ref: '#/definitions/User'
 *       '401':
 *         description: No auth token / no user found in db with that name
 *       '403':
 *         description: JWT token and username from client don't match
 */
router.get('/findUserByUsername',authenticateToken ,async(req, res, next) => {
    User.findOne({
      where: {
        username: req.query.username,
      },
    }).then((userInfo) => {
      if (userInfo != null) {
        console.log('user found in db from findUsers');
        res.status(200).send({
          auth: true,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          email: userInfo.email,
          username: userInfo.username,
          message: 'user found in db',
        });
      } else {
        console.error('no user exists in db with that username');
        res.status(401).send('no user exists in db with that username');
      }
    });
});

/**
 * @swagger
 * /findUserByEmail:
 *   post:
 *     tags:
 *       - Users
 *     name: Find user by Email ID
 *     summary: Finds a user by Email ID
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
 *         description: A single user object
 *         schema:
 *           $ref: '#/definitions/User'
 *       '401':
 *         description: No auth token / no user found in db with that name
 *       '403':
 *         description: JWT token and username from client don't match
 */
 router.post('/findUserByEmail',authenticateToken ,async(req, res, next) => {
  user= await User.findOne({where:{id:req.user.id}});
  if (user.email === req.body.email) {
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((userInfo) => {
      if (userInfo != null) {
        console.log('user found in db from findUsers');
        res.status(200).send({
          auth: true,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          email: userInfo.email,
          username: userInfo.username,
          message: 'user found in db',
        });
      } else {
        console.error('no user exists in db with that email');
        res.status(401).send('no user exists in db with that email');
      }
    });
  } else {
    console.error('jwt id and email do not match');
    res.status(403).send('email and jwt token user email do not match');
  }
});

module.exports = router;