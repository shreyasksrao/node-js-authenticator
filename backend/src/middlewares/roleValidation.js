/*jshint esversion: 8 */
const redisClient = require('../redisClient');
let { Role, Endpoint, Permission } = require('../sequelize');


async function getEndpointIdMap(){
    console.log(`Building Endpoint ID Map...`);
    let endpointIdMap = {};
    let endpoints = await Endpoint.findAll({});
    await endpoints.forEach(e => {
        endpointIdMap[e.id] = {"endpoint": e.endpoint, "method": e.method}; 
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
            "endpoint": endpointIdMap[p.endpointId].endpoint,
            "method": endpointIdMap[p.endpointId].method,
            "permissionType": p.permissionType
        };
    });
    console.log(`Permission ID Map : ${JSON.stringify(permissionIdMap)}`);
    return permissionIdMap;
}

async function buildRoleMap(){
    let roleMap = {};
    let roles = await Role.findAll({});
    await roles.forEach(r => {
        const permissions = r.permissions.permissions;
        roleMap[r.name] = [];
        permissions.forEach(p => {
            roleMap[r.name].push({
                
            });
        });
    }); 
}

async function validateRole(){

}

module.exports = {
    buildPermissionMap
};