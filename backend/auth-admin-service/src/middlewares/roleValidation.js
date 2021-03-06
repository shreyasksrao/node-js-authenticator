/*jshint esversion: 8 */
const redisClient = require('../redisClient');
let { Role, Endpoint, Permission } = require('../sequelize');

// Globals
var IN_MEMORY_OBJECT_CACHE_EXPIRATION_AT = Math.floor(new Date().getTime() / 1000) - 100;
var IN_MEMORY_CACHE = {};
var IN_MEMORY_ROLE_ENDPOINT_CACHE = {};

async function getEndpointIdMap(){
    console.log(`Building Endpoint ID Map...`);
    let endpointIdMap = {};
    let endpoints = await Endpoint.findAll({});
    await endpoints.forEach(e => {
        endpointIdMap[e.id] = {"name": e.name, "endpoint": e.endpoint, "method": e.method}; 
    });
    console.log(`Endpoint ID Map: ${JSON.stringify(endpointIdMap)}`);
    return endpointIdMap;
}

async function buildPermissionMap(){
    let permissionIdMap = {};
    const endpointIdMap = await getEndpointIdMap();
    console.log(`Building Permission Map...`);
    let permissions = await Permission.findAll({});
    await permissions.forEach(p => {
        permissionIdMap[p.id] = {
            "name": endpointIdMap[p.endpoint_id].name,
            "endpoint": endpointIdMap[p.endpoint_id].endpoint,
            "method": endpointIdMap[p.endpoint_id].method,
            "permissionType": p.permission_type
        };
    });
    console.log(`Permission ID Map : ${JSON.stringify(permissionIdMap)}`);
    return permissionIdMap;
}

async function buildRoleMap(){
    console.log(`Building Role Map...`);
    let roleMap = {};
    let roleEndpointMap = {};
    const permissionIdMap = await buildPermissionMap();
    let roles = await Role.findAll({});
    await roles.forEach(r => {
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
        IN_MEMORY_CACHE = roleMap;
        IN_MEMORY_ROLE_ENDPOINT_CACHE = roleEndpointMap;
        IN_MEMORY_OBJECT_CACHE_EXPIRATION_AT = Math.floor(new Date().getTime() / 1000) + 12*60*60;
    }); 
    console.log(`Role Map: ${JSON.stringify(roleMap)}`);
}

async function validateRole(req, res, next){
    try {
        console.log(IN_MEMORY_ROLE_ENDPOINT_CACHE);
        let currentTime = Math.floor(new Date().getTime() / 1000);
        if (currentTime > IN_MEMORY_OBJECT_CACHE_EXPIRATION_AT){
            console.log(`Building Role Map due to In-Memory Cache expire...`);
            await buildRoleMap();
            console.log(IN_MEMORY_CACHE);
        }
        let endpointName = req.endpointName;      

        let userRoles = req.user.ur; 
        for(let i=0; i<userRoles.length; i++){
            let hasAccessToEndpoints = IN_MEMORY_ROLE_ENDPOINT_CACHE[userRoles[i]];
            if (hasAccessToEndpoints.includes('*') || hasAccessToEndpoints.includes(endpointName))
                return next();  
        }
        return res.status(403).json({
            statusCode: 403,
            message: `User doesn't have the role to access this endpoint !!`
        });
    } catch (error) {
        console.error(`Promise error ${error}`);
    }   
}

module.exports = {
    validateRole,
    buildRoleMap
};