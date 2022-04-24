/*jshint esversion: 8 */
/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const { Permission } = require('../../sequelize');
const router = require("express").Router();

// Load the Winston logger
const logger = require('../../winston.conf.js');
const { validateBodyParamsExistence } = require('../../utils/validateBodyParameters');
const { VALID_METHODS, httpMethodsValidator } = require('../../validators/httpMethodsValidator');
/**
 * @swagger
 * /getPermission:
 *   post:
 *     tags:
 *       - Permission
 *     name: Get Permission/s
 *     summary: Gets the Permission/s by passing [name, endpoint, method, permissionType]. Multiple filters allowed. If now filters are passed, returns all Permissions.
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
 *             name:
 *               description: Unique name given to a permission (Ex - <Permission type>_<Resource name like URL>)
 *             endpoint:
 *               type: string
 *               description: REST endpoint to which the permission is assigned.
 *             method:
 *               type: string
 *               description: HTTP method
 *             permissionType:
 *               type: string
 *               description: Permission type (Allowed values are - "Allow" or "Deny")
 *     responses:
 *       '200':
 *         description: Permissions fetched successfully.
 *       '400':
 *         description: Bad Request.
 *       '500':
 *         description: Internal Server error.
 *       '403':
 *         description: Username or email already taken.
 */

router.post('/getPermission', async (req, res) => {
  try{
    let permissionAttributes = [];
    for (var attr in Permission.rawAttributes)
      permissionAttributes.push(attr);
  
    let filters = {};
    for(var key in req.body){
        if (! permissionAttributes.includes(key)){
            return res.status(401).json({
              statusCode: 401,
              message: `Invalid filter !! Valid filters are - ${JSON.stringify(permissionAttributes)}`
          });
        }
        filters[key] = req.body[key];
    }
  
    let permissionArray = [];
  
    // TODO : Implement Caching ...
    if (Object.entries(filters).length === 0){
      permissionArray = await Permission.findAll();
    }
    else{
      permissionArray = await Permission.findAll({ where: filters});
    }
  
    return res.status(200).json({
        statusCode: 200,
        message: `Permissions fetched successfully`,
        filters: filters,
        permissions: permissionArray
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