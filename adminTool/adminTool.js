/*jshint esversion: 8 */
const inquirer = require('inquirer');
const program = require('commander');
const figlet = require('figlet');
const { Pool } = require('pg');

const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs");

var colors = require('colors');
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

async function connectToDB(dbHost, dbPort, db, dbUser, dbPassword){
    const pool = new Pool({
        user: dbUser,
        host: dbHost,
        database: db,
        password: dbPassword,
        port: dbPort,
    });
    return pool;
}

const usernameValidator = (input, dbPool) => {
    if (input.length > 20) {
        console.error('[ ERROR ] Username should be less than 20 Characters !'.error);
        dbPool.end();
        process.exit(-1);
    }
    return true;
};

const emailValidator = (email, dbPool) => {
    if(! email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        console.error(`[ ERROR ] Invalid Email (Regex doesn't match) !`.error);
        dbPool.end();
        process.exit(-1);
    }
    return true;
};

const passwordValidator = (password, dbPool) => {
    if(password.length < 8){
        console.error(`[ ERROR ] Password length should be minimum 8 characters.`.error);
        dbPool.end();
        process.exit(-1);
    }
    if( ! password.match(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)){
        console.error(`[ ERROR ] Password should contains atleast 1 special character.`.error);
        dbPool.end();
        process.exit(-1);
    }
    return true;
};

async function generateAsciiArt() {  
    return new Promise((resolve, reject) => {   
        figlet.text('Admin Tool',
            {font: 'ANSI Shadow', horizontalLayout: 'default', verticalLayout: 'default'},      
            function(err, data) {    
                if (err) {
                    console.log('Something went wrong...');          
                    console.dir(err);          
                    reject(err);        
                }        
                resolve(data);      
            }    
        );  
    });
}

function setupCommander(){
    program
        .command('run')
        .description('Launch the admin tool.\n\nRequired Options: [ -d, -U, -P ]')
        .option('-h, --dbHost [host]', 'PostgreSQL server hostname', "localhost")
        .option('-p, --dbPort [port]', 'PostgreSQL server port', 5432)
        .option('-d, --db <database>', 'Database name')
        .option('-U, --dbUser <username>', 'Database Username')
        .option('-P, --dbUserPassword <password>', 'Database User Password')
        .option('-s, --schema [schema name]', 'Schema name where the tables are present', 'auth_schema')
        .action(runHandler);

    program.parse(process.argv);
}

async function createSuperUserRoleHandler(pool, schema){
    const roleId = uuidv4(); 
    const roleName = 'super_admin';
    const roleDescription = 'Super User role which has access to all the Endpoints';
    let roleCreationDate = new Date();
    let permissions = {permissions: ['*']};

    const checkRoleExistsQuery = `SELECT EXISTS(SELECT 1 FROM ${schema}."Role" WHERE name=$1)`;
    const res = await pool.query(checkRoleExistsQuery, [roleName]);
    console.log(`[ DEBUG ] Checking for the role existence...`.debug);
    if(res.rows[0].exists == true){
        console.error(`[ ERROR ] Role with the name ${roleName} already exists !`.error);
        pool.end();
        process.exit(-1);
    }

    const insertUserQuery = `INSERT INTO ${schema}."Role"(id, name, description, created_at, permissions)
                             VALUES($1, $2, $3, $4, $5) RETURNING id, name, permissions`;
    const roleValues = [roleId, roleName, roleDescription, roleCreationDate, permissions ];
    console.log(`[ DEBUG ] Creating the Role '${roleName}' with ID '${roleId}' in the database...`.debug);
    const roleCreateRes = await pool.query(insertUserQuery, roleValues);
    console.log(JSON.stringify(roleCreateRes.rows));
    pool.end();
    return 0;
}

async function createSuperUserHandler(pool, schema){
    let { username } = await inquirer.prompt([
        {
            name: 'username',
            message: 'Enter the Super Admin Username : ',
            default: 'super_admin',
    }]);
    usernameValidator(username, pool);

    // Check if the Username already exists or not
    const checkUserExistsQuery = `SELECT EXISTS(SELECT 1 FROM ${schema}."User" WHERE username=$1)`;
    const values = [username];
    const res = await pool.query(checkUserExistsQuery, values);
    console.log(`[ DEBUG ] Checking for the user existence...`.debug);
    if(res.rows[0].exists == true){
        console.error(`[ ERROR ] User with the name ${username} already exists !`.error);
        pool.end();
        process.exit(-1);
    }
    // Take the User details from the Console
    let { first_name } = await inquirer.prompt([
        {
            name: 'first_name',
            message: 'Enter First name : ',
            default: 'admin',
        }
    ]);
    let { last_name } = await inquirer.prompt([
        {
            name: 'last_name',
            message: 'Enter Last name : ',
            default: 'user',
        }
    ]);

    let { email } = await inquirer.prompt([
        {
            name: 'email',
            message: 'Enter Email ID : ',
        }
    ]);
    emailValidator(email, pool);

    let { password1 } = await inquirer.prompt([
        {
            type: "password",
            name: 'password1',
            message: 'Enter Password : ',
        },
    ]);
    passwordValidator(password1, pool);

    let { password2 } = await inquirer.prompt([
        {
            type: "password",
            name: 'password2',
            message: 'Confirm Password',
        }
    ]);
    if(password1 != password2){
        console.error(`[ ERROR ] Passwords doesn't match !`.error);
        return -1;
    }
    let { phone_number } = await inquirer.prompt([
        {
            name: 'phone_number',
            message: 'Enter Phone number (<Country code> <Phone number>) : ',
        }
    ]);     
    let userId = uuidv4(); 
    let creationDate = new Date();
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password1, salt);  
    console.log(`[ DEBUG ] Creating the User '${username}' with ID '${userId}' in the database...`.debug);
    const insertUserQuery = `INSERT INTO ${schema}."User"(id, first_name, last_name, email, username, password, phone_number, roles, email_verified, status, created_at)
                             VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, username`;
    const userValues = [userId, first_name, last_name, email, username, hashedPassword, phone_number, "super_admin", true, "active", creationDate ];
    const userCreateRes = await pool.query(insertUserQuery, userValues);
    console.log(userCreateRes.rows);
    pool.end();
    return 0;
}

async function runHandler(options){
    console.log(await generateAsciiArt());
    console.log(`[ DEBUG ] Launching Admin tool...`.debug);
    // If DB is not passed throw  Error!!
    if(options.db == undefined){
        console.error(`[ ERROR ] Option 'Database name' is required`.error);
        return -1;
    }   
    // If the DB Username is not passed throw  Error!!
    if(options.dbUser == undefined){
        console.error(`[ ERROR ] Option 'Database Username' is required`.error);
        return -1;
    }
    // If DB User password is not passed, Ask the password
    if(options.dbUserPassword == undefined){
        const { dbPassword } = await inquirer.prompt({
            type: 'password',
            mask: '*',
            name: 'dbPassword',
            message: `Enter the Password for the user ${options.dbUser} :`
        });
        options.dbUserPassword = dbPassword;
    }
    // Connects to PostgreSQL database
    console.log(`[ DEBUG ] Connecting to Database ${options.db} on ${options.dbHost}...`.debug);
    const pool = await connectToDB(options.dbHost, parseInt(options.dbPort), options.db, options.dbUser, options.dbUserPassword);

    const { taskChoice } = await inquirer.prompt({
        type: 'list',
        name: 'taskChoice',
        message: 'What do you want to do?',
        choices: [
            'Create Super User',
            'Create Super User Role',
            new inquirer.Separator(),
            {
                name: 'Update Super User',
                disabled: 'Unavailable at this time',
            },   
            new inquirer.Separator(),
            {
                name: 'Delete Super User',
                disabled: 'Unavailable at this time',
            },
        ],
    });
    if(taskChoice == 'Create Super User')
        return createSuperUserHandler(pool, options.schema);
    else if(taskChoice == 'Create Super User Role')
        return createSuperUserRoleHandler(pool, options.schema);
}

setupCommander();
