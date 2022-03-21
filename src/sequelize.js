const Sequelize = require('sequelize');
const UserModel = require('./models/User');
const UserLoginModel = require('./models/UserLogin');
const RoleModel = require('./models/Role');
const PermissionModel = require('./models/Permission');
const BlacklistTokenModel = require('./models/BlacklistToken');

let path = require('path');
let dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

const sequelize = new Sequelize(process.env['DB_NAME'], process.env['DB_USER'], process.env['DB_PASSWORD'], {
  host: process.env['DB_HOST'],
  dialect:  'postgres',
  protocol: 'postgres',
  port:     process.env['DB_PORT'],
  ssl: false,
  // dialectOptions: {
  //   "ssl": {
  //     "require":false,
  //     "rejectUnauthorized": false
  //   }
  // },
  define: {
    timestamps: false
  },
  pool: {
      max: 20,
      min: 0,
      idle: 5000
  },
  logging:false
});

const User = UserModel(sequelize, Sequelize);
const UserLogin = UserLoginModel(sequelize, Sequelize);
const BlacklistToken = BlacklistTokenModel(sequelize, Sequelize);
const Role = RoleModel(sequelize, Sequelize);
const Permission = PermissionModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('[INFO] Database and Tables have been created'.green.bold);
});

module.exports = { User, UserLogin, BlacklistToken, Role, Permission };