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
 *       description:
 *         type: string
 *         description: A brief description about the Endpoint
 *       endpoint:
 *         type: string
 *         description: REST endpoint
 *       method:
 *         type: string
 *         description: HTTP method of the REST endpoint
 *       isDepricated:
 *         type: boolean
 *         description: Is this endpoint depricated
 *         default: false
 *     required:
 *       - id
 *       - endpoint
 *       - method
 */
/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Endpoint', {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
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
		isDepricated:{
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, {
		tableName: 'Endpoint'
	});
};