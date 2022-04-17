/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { User } = require('../sequelize');
const bcrypt = require("bcryptjs");
const router = require("express").Router();

// Load the Winston logger
const logger = require('../winston.conf.js');
const { validateBodyParamsExistence } = require('../utils/validateBodyParameters');
/**
 * @swagger
 * /registerUser:
 *   post:
 *     tags:
 *       - Users
 *     name: Register
 *     summary: Register a new user
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             first_name:
 *               description: New user's first name
 *               required: true
 *             last_name:
 *               type: string
 *               description: New user's last name
 *             username:
 *               type: string
 *               description: User name (Short name of the User which can be displayed on the UI)
 *             email:
 *               type: string
 *               description: Unique Email ID
 *             password:
 *               type: string
 *               description: Password must contains minimum of 8 Characters (Min 1 Special character, Upper case, Lower case and number).
 *               format: password
 *             phoneNumber:
 *               type: string
 *               description: Phone number of the registered user (Format - <Country code> <Phone number>)
 *           required:
 *             - username
 *             - first_name
 *             - last_name
 *             - email
 *             - password
 *             - phoneNumber
 *     responses:
 *       '200':
 *         description: User created
 *       '403':
 *         description: Username or email already taken
 */

router.post('/registerUser', async (req, res) => {
  // Validate weather the request body contains all the parameters or not
  var bodyParameterValidationResult = validateBodyParamsExistence(req, ['username', 'email', 'password', 'first_name', 'last_name', 'phoneNumber']);
  if (bodyParameterValidationResult.status == false){
    logger.debug(`Body parameter validation error: ${bodyParameterValidationResult.message}`);
    return res.status(401).send({
      statusCode: 401,
      message: bodyParameterValidationResult.message
    });
  }
  logger.debug(`Validated body parameters successfully...`);

  // If User exists, then throw the Error
  const userExists = await User.findOne({ where: {username: req.body.username ,email: req.body.email } });
  if (userExists){
    logger.info(`Username or Email is already taken`);
    logger.debug(`User details -- User name: ${req.body.username}, Email: ${req.body.email}`);
    return res.status(400).send({
      statusCode: 400,
      message: 'Bad request !! - Username or Email already taken',
    });
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // Create a User in the DB and send it to the User
  try {
    logger.debug(`Creating a User -- Username: ${req.body.username} Email: ${req.body.email}`);
    const savedUser = await User.create({
      email:req.body.email,
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber
    });
    req.user=savedUser;
    req.auth={
      id:req.user.id,
      register:true
    };
    logger.info(`User created and saved in the DB -- User ID: ${req.user.id} Username: ${req.body.username} Email: ${req.body.email}`);
    return res.status(201).send({
      statusCode: 201,
      message: `User has been created. User ID: ${req.user.id} Username: ${req.body.username} Email: ${req.body.email}`,
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