/*jshint esversion: 8 */
const Sequelize = require('sequelize');
const UserModel = require('./models/User');
const UserLoginModel = require('./models/UserLogin');
const RoleModel = require('./models/Role');
const PermissionModel = require('./models/Permission');
const EndpointModel = require('./models/Endpoint');
const EndpointTagModel = require('./models/EndpointTag');

let path = require('path');
let dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

const sequelize = new Sequelize(process.env.AUTH_DB, process.env.AUTH_DB_USER, process.env.AUTH_DB_USER_PASSWORD, {
  host: process.env.DB_HOST,
  dialect:  'postgres',
  protocol: 'postgres',
  port:     process.env.DB_PORT,
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
const Role = RoleModel(sequelize, Sequelize);
const Permission = PermissionModel(sequelize, Sequelize);
const Endpoint = EndpointModel(sequelize, Sequelize);
const EndpointTag = EndpointTagModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('[INFO] Database and Tables have been created'.green.bold);
  let r = require('./middlewares/roleValidation');
  r.buildRoleMap();
});


module.exports = { sequelize, User, UserLogin, Role, Permission, Endpoint, EndpointTag };