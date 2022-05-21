/*jshint esversion: 8 */
/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   Endpoint:
 *     type: object
 *     properties:
 *       id:
 *         type: UUID
 *         description: Unique ID generated for every Endpoint (Auto-generated field).
 *       name:
 *         type: string
 *         description: Name given to an Endpoint (Required during Role-Permission mapping creation)
 *       description:
 *         type: string
 *         description: A brief description about the Endpoint
 *       endpoint:
 *         type: string
 *         description: REST endpoint
 *       method:
 *         type: string
 *         description: HTTP method of the REST endpoint
 *       is_depricated:
 *         type: boolean
 *         description: Is this endpoint depricated
 *         default: false
 *     required:
 *       - id
 *       - name
 *       - endpoint
 *       - method
 */
/* jshint indent: 1 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../config/config.env') });

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Endpoint', {
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
		endpoint: {
			type: DataTypes.STRING,
			allowNull: false
		},
		method:{
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'GET'
		},
		is_depricated:{
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, {
		tableName: 'Endpoint',
		schema: String(process.env.AUTH_SCHEMA)
	});
};