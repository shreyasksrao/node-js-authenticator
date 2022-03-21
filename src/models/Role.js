/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   Role:
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
 *         description: Permission array (JSON string) Ex: {"permissions": ["<Permission ID>"]}
 *     required:
 *       - id
 *       - name
 */
/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Role', {
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
			allowNull: true,
			get() {
				return JSON.parse(this.getDataValue("permissions"));
			},
			set(value) {
				return this.setDataValue("permissions", JSON.stringify(value));
			}
		}
	}, {
		tableName: 'Role'
	});
};