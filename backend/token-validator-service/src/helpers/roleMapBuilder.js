/*jshint esversion: 8 */
let { connectToDB } = require('./postgresConnector');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../config/config.env') });

const AUTH_SCHEMA = process.env.AUTH_SCHEMA;
const AUTH_DB_HOST = process.env.AUTH_DB_HOST;
const AUTH_DB_PORT = process.env.AUTH_DB_PORT;
const AUTH_DB = process.env.AUTH_DB;
const AUTH_DB_USER = process.env.AUTH_DB_USER;
const AUTH_DB_USER_PASSWORD = process.env.AUTH_DB_USER_PASSWORD;

const ENDPOINT_TABLE = 'endpoint';
const PERMISSION_TABLE = 'permission';
const ROLE_TABLE = 'role';


async function buildEndpointIdMap(pool){
    try {
        console.log(`Building Endpoint ID Map...`);
        let endpointIdMap = {};

        let fetchAllEndpointQuery = `SELECT id, name, endpoint, method FROM ${AUTH_SCHEMA}.${ENDPOINT_TABLE};`;
        let res = await pool.query(fetchAllEndpointQuery);
        let endpoints = res.rows;

        endpoints.forEach(e => {
            endpointIdMap[e.id] = {"name": e.name, "endpoint": e.endpoint, "method": e.method}; 
        });
        // console.log(`Endpoint ID Map: ${JSON.stringify(endpointIdMap)}`);
        return endpointIdMap; 
    } catch (error) {
        console.error(`Server Error: ${error}`);
        return -1;
    } 
}

async function buildPermissionMap(pool){
    console.log(`Building Permission Map...`);
    try {
        let permissionIdMap = {};
        const endpointIdMap = await buildEndpointIdMap(pool);

        let fetchAllPermissionsQuery = `SELECT id, endpoint_id, permission_type FROM ${AUTH_SCHEMA}.${PERMISSION_TABLE};`;
        let res = await pool.query(fetchAllPermissionsQuery);
        let permissions = res.rows;
    
        permissions.forEach(p => {
            permissionIdMap[p.id] = {
                "name": endpointIdMap[p.endpoint_id].name,
                "endpoint": endpointIdMap[p.endpoint_id].endpoint,
                "method": endpointIdMap[p.endpoint_id].method,
                "permissionType": p.permission_type
            };
        });
        // console.log(`Permission ID Map : ${JSON.stringify(permissionIdMap)}`);
        return permissionIdMap;
    } catch (error) {
        console.error(`Server Error: ${error}`);
        return -1;
    }
}

async function buildRoleMap(){
    console.log(`Building Role Map...`);
    try {
        console.log(`[ DEBUG ] Connecting to Postgres DB...`);
        const pool = await connectToDB(AUTH_DB_HOST, AUTH_DB_PORT, AUTH_DB, AUTH_DB_USER, AUTH_DB_USER_PASSWORD);

        let roleMap = {};
        let roleEndpointMap = {};
        const permissionIdMap = await buildPermissionMap(pool);

        let fetchAllRolesQuery = `SELECT id, name, permissions FROM ${AUTH_SCHEMA}.${ROLE_TABLE};`;
        let res = await pool.query(fetchAllRolesQuery);
        let roles = res.rows;

        roles.forEach(r => {
            const permissions = JSON.parse(JSON.stringify(r.permissions)).permissions;
            roleMap[r.name] = [];
            roleEndpointMap[r.name] = [];
            permissions.forEach(p => {
                if(p == '*'){
                    roleMap[r.name].push('*');
                    roleEndpointMap[r.name].push('*');
                    roleString = '*';
                    return;
                }
                roleMap[r.name].push(permissionIdMap[p]);
                roleEndpointMap[r.name].push(permissionIdMap[p].name);
                
            });
        }); 
        await pool.end();
        return {
            roleMap,
            roleEndpointMap
        };
    } catch (error) {
        console.error(`Server Error: ${error}`);
        return -1;
    } 
}

module.exports = {
    buildRoleMap,
}
