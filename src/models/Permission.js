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
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		},
		created_by: {
			type: DataTypes.UUID,
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