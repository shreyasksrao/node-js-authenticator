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
		permissions: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true
		}
	}, {
		tableName: 'Role'
	});
};