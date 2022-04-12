/*jshint esversion: 8 */
/* eslint-disable no-console */
const {User} = require('../sequelize');
const router = require("express").Router();
const bcrypt = require("bcryptjs");

var { generateAndSendToken } = require('../middlewares/generateAndSendToken');
const { validateBodyParamsExistence } = require('../utils/validateBodyParameters');
const logger = require('../winston.conf.js');

/**
 * @swagger
 * /loginUser:
 *   post:
 *     tags:
 *       - Users
 *     name: Login
 *     summary: Logs in a user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: "The Email and password for User login"
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               required: true
 *             password:
 *               type: string
 *               required: true
 *     responses:
 *       '200':
 *         description: User found and logged in successfully
 *         schema:
 *           type: object
 *           properties:
 *             auth:
 *               type: boolean
 *               description: Weather the Authentication is success or not
 *             token:
 *               type: string
 *               description: JWT token
 *             message:
 *               type: string
 *               description: String message about the status
 *       '401':
 *         description: Bad username, not found in db
 *       '403':
 *         description: Username and password don't match
 */

router.post('/loginUser', async (req, res, next) => {
      // Validate weather the request body contains all the parameters or not
      const bodyParameterValidationResult = validateBodyParamsExistence(req, ['email', 'password']);
      if (bodyParameterValidationResult.status == false){
        logger.debug(`Body parameter validation error: ${bodyParameterValidationResult.message}`);
        return res.status(401).send({
          statusCode: 401,
          message: bodyParameterValidationResult.message
        });
      }
      logger.debug(`Validated body parameters successfully...`);

      //check if the email exists or not ?
      const userExists = await User.findOne({ where: {email: req.body.email  } });
      if (!userExists){
        logger.debug(`User with this EMAIL (${req.body.email}) doesn't exist !`);
        return res.status(401).send({
          statusCode: 401,
          message: `User with this EMAIL (${req.body.email}) doesn't exist !`
        });
      }  

      //check password
      const validPass = await bcrypt.compare(req.body.password, userExists.password);
      if (!validPass){
        logger.debug(`Password doesn't match for this EMAIL (${req.body.email}) !`);
        return res.status(401).send({
          statusCode: 401,
          message: `Password doesn't match for this EMAIL (${req.body.email}) !`
        });
      }

      // Check user status
      const userStatus = userExists.status;
      if (userStatus != 'active'){
        logger.debug(`User status is ${userStatus} for this EMAIL (${req.body.email}) !`);
        return res.status(403).send({
          statusCode: 403,
          message: `User status is ${userStatus} for this EMAIL (${req.body.email}) !`
        });
      }

      req.user=userExists;
      req.auth={
        id:req.user.id,
        register:true
      };
      next();
  }, 
  generateAndSendToken
);

 
module.exports = router;