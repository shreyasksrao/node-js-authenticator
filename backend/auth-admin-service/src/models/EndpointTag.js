/*jshint esversion: 8 */
/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   EndpointTag:
 *     type: object
 *     properties:
 *       id:
 *         type: UUID
 *         description: Unique ID generated for every tag (Auto-generated field).
 *       tag_name:
 *         type: string
 *         description: Tag name
 *       tag_value:
 *         type: string
 *         description: Value of the given tag
 *       endpoint_name:
 *         type: string
 *         description: Name of the endpoint(Must match with the name column in Endpoint table)
 *     required:
 *       - id
 *       - tag_name
 *       - tag_value
 *       - endpoint_name
 */
/* jshint indent: 1 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../config/config.env') });

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('endpoint_tag', {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
		},
		tag_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		tag_value: {
			type: DataTypes.STRING,
			allowNull: true
		},
		endpoint_name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'endpoint_tag',
		schema: String(process.env.AUTH_SCHEMA)
	});
};