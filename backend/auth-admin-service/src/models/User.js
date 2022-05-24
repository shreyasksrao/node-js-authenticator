/*jshint esversion: 8 */
/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   user:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique ID generated for every User (Auto-increment field).
 *       first_name:
 *         type: string
 *         description: First name of the User
 *       last_name:
 *         type: string
 *         description: Last name of the User
 *       email:
 *         type: string
 *         description: Email address of the User
 *       username:
 *         type: string
 *         description: Username of the User. This will be displayed on the UI.
 *       password:
 *         type: string
 *         format: password
 *         description: Password of the User
 *       phone_number:
 *         type: string
 *         description: Phone number of the User (Format - <Country code> <Phone number> | Ex for India - +91 8765432189)
 *       role:
 *         type: string
 *         description: Roles assigned to the User. Multiple roles can be added using "," as delimiter.
 *         default: default
 *       email_verified:
 *         type: boolean
 *         description: Is email verified for this User
 *         default: false
 *       status:
 *         type: string
 *         default: inactive
 *         description: Status of the User
 *       created_at:
 *         type: Date
 *         description: Time at which the User is created
 *         default: Current DB time
 *     required:
 *       - email
 *       - username
 *       - password
 *       - phone_number
 */
 const path = require('path');
 const dotenv = require('dotenv');
 dotenv.config({ path: path.join(__dirname, '../../config/config.env') });

 module.exports = function(sequelize, DataTypes) {
      return sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        tenant_name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'default'
        },
        roles: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user',
            get() {
                const roleString = this.getDataValue('roles');
                let rolesArray = roleString.split(",");
                return rolesArray;
            },
            set(rolesArray) {
                let roleString = "";
                rolesArray.forEach(role => {
                    roleString = roleString + ',' + String(role);
                });
                this.setDataValue('roles', roleString);
            }
        },
        email_verified: {
            type: DataTypes.BOOLEAN, 
            allowNull: false,
            defaultValue: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'inactive'
        },
        created_at: {
            type: DataTypes.DATE, 
            defaultValue: sequelize.fn('now')
        }
      }, {
          tableName: 'user',
          schema: process.env.AUTH_SCHEMA
    });
  };
