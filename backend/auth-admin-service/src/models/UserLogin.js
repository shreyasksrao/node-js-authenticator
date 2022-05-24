/*jshint esversion: 8 */
/* jshint indent: 1 */
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../config/config.env') });

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user_login', {
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
		],
		tableName: 'user_login',
		schema: process.env.AUTH_SCHEMA
  	});
};