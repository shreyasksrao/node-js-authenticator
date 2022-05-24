/*jshint esversion: 8 */
/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   role:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique ID generated for every Role (Auto-increment field).
 *       name:
 *         type: string
 *         description: Role name (Should be Unique)
 *       description:
 *         type: string
 *         description: A brief description about the Role
 *       createdAt:
 *         type: Date
 *         description: Role creation time
 *         default: Current time
 *       createdBy:
 *         type: uuid
 *         description: ID of the User who created the role
 *       permissions:
 *         type: JSON
 *         description: Permission array (JSON string). Value should be an array of Permission IDs with "permissions" as Key
 *     required:
 *       - name
 *       - description
 *       - permissions
 */
/* jshint indent: 1 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../config/config.env') });

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('role', {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		},
		created_by: {
			type: DataTypes.UUID,
			allowNull: true
		}, 
		// Stores the Permission ID in an JSON array
		permissions: {
			type: DataTypes.JSON,
			allowNull: true
		}
	}, {
		tableName: 'role',
		schema: process.env.AUTH_SCHEMA
	});
};