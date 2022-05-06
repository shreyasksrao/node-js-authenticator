/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User_Login', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.UUID,
			allowNull: false
		},
		logged_in_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		ip_address: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		token_id: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		device: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	},{
	indexes: [
	  { fields: ['user_id', 'token_id'], unique: true }
	]
  	}, {
		tableName: 'User_Login'
	});
};