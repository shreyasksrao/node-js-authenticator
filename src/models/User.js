/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   User:
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
 *       phonenumber:
 *         type: string
 *         description: Phone number of the User. (Format: <Country code> <Phone number>. Ex for India: +91 8765432189)
 *       organization:
 *         type: string
 *         default: default
 *         description: Organization to which the User belongs to.
 *       role:
 *         type: string
 *         description: Roles assigned to the User. Multiple roles can be added using "," as delimiter.
 *         default: default
 *       emailVerified:
 *         type: boolean
 *         description: Is email verified for this User
 *         default: false
 *       status:
 *         type: string
 *         default: inactive
 *         description: Status of the User
 *       createdAt:
 *         type: Date
 *         description: Time at which the User is created
 *         default: Current DB time
 *       resetPasswordToken:
 *         type: string
 *       resetPasswordExpires:
 *         type: string
 *         format: date-time
 *     required:
 *       - email
 *       - username
 *       - password
 *       - phonenumber
 */

 module.exports = function(sequelize, DataTypes) {
      return sequelize.define('User', {
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
        phoneNumber: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        organization: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'default'
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'default',
            get() {
                const roleString = this.getDataValue('role');
                let roleArray = roleString.split(",");
                return roleArray;
            },
            set(roleArray) {
                let roleString = "";
                roleArray.forEach(role => {
                    roleString = roleString + ',' + String(role)
                });
                this.setDataValue('role', roleString);
            }
        },
        emailVerified: {
            type: DataTypes.BOOLEAN, 
            allowNull: false,
            defaultValue: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'inactive'
        },
        createdAt: {
            type: DataTypes.DATE, 
            defaultValue: sequelize.fn('now')
        },
        resetPasswordToken: DataTypes.STRING,
        resetPasswordExpires: DataTypes.DATE,
      }, {
          tableName: 'User'
    });
  };
