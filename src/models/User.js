/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       first_name:
 *         type: string
 *       last_name:
 *         type: string
 *       email:
 *         type: string
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       resetPasswordToken:
 *         type: string
 *       resetPasswordExpires:
 *         type: string
 *         format: date-time
 *     required:
 *       - email
 *       - username
 *       - password
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
