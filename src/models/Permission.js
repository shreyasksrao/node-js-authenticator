/*jshint esversion: 8 */
/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   Permission:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         description: Unique ID generated for every Permission (Auto-increment field).
 *       name:
 *         type: string
 *         description: Permission name (Should be Unique)
 *       description:
 *         type: string
 *         description: A brief description about the Permission
 *       endpoint:
 *         type: string
 *         description: REST endpoint
 *       permissionType:
 *         type: string
 *         description: One of ['Allow', 'Deny']
 *     required:
 *       - id
 *       - name
 *       - endpoint
 *       - permissionType
 */
/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Permission', {
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
        permissionType: {
			type: DataTypes.STRING,
			allowNull: false,
            defaultValue: 'Allow'
		}
	}, {
		tableName: 'Permission'
	});
};