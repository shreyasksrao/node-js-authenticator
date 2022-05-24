const axios = require('axios');

const endpoints = [
    {
        name: "create_new_endpoint",
        description: "Endpoint to Create a new endpoint resource",
        endpoint: "/api/v1/createEndpoint",
        method: "POST",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "endpoint"
            },
            {
                name: "method",
                value: "post"
            }
        ]
    },
    {
        name: "get_all_permissions",
        description: "Endpoint to Get all the Permissions",
        endpoint: "/api/v1/getAllPermissions",
        method: "GET",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "endpoint"
            },
            {
                name: "method",
                value: "get"
            }
        ]
    },
    {
        name: "get_endpoints_by_hint",
        description: "Endpoint to Get the endpoint resources by passing Hints",
        endpoint: "/api/v1/getEndpoints/:endpointHintColumn/:endpointHintValuee",
        method: "GET",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "endpoint"
            },
            {
                name: "method",
                value: "get"
            }
        ]
    },
    {
        name: "delete_endpoint_by_passing_endpoint_id",
        description: "Endpoint to Delete an endpoint by passing the ID",
        endpoint: "/api/v1/deleteEndpointById/:endpoint_id",
        method: "DELETE",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "endpoint"
            },
            {
                name: "method",
                value: "delete"
            }
        ]
    },
    {
        name: "delete_endpoint_by_passing_endpoint_name",
        description: "Endpoint to Delete an endpoint by passing the name",
        endpoint: "/api/v1/deleteEndpoint/:endpointName",
        method: "DELETE",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "endpoint"
            },
            {
                name: "method",
                value: "delete"
            }
        ]
    },
    {
        name: "get_all_permissions",
        description: "Endpoint to Get all the Permissions",
        endpoint: "/api/v1/getAllPermissions",
        method: "GET",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "permission"
            },
            {
                name: "method",
                value: "get"
            }
        ]
    },
    {
       
        name: "get_permissions_by_hint",
        description: "Endpoint to Get Permissions by passing Hints",
        endpoint: "/api/v1/getPermissions/:key/:key_hint",
        method: "GET",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "permission"
            },
            {
                name: "method",
                value: "get"
            }
        ]
    },
    {
        name: "update_permission_by_passing_id",
        description: "Endpoint to Update the Permission",
        endpoint: "/api/v1/updatePermission/:permission_id",
        method: "PUT",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "permission"
            },
            {
                name: "method",
                value: "put"
            }
        ]
    },
    {
        name: "create_permission",
        description: "Endpoint to create a new Permission",
        endpoint: "/api/v1/createPermission",
        method: "POST",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "permission"
            },
            {
                name: "method",
                value: "post"
            }
        ]
    },
    {
        name: "delete_permission_by_passing_id",
        description: "Endpoint to Delete an existing Permission",
        endpoint: "/api/v1//deletePermission/:permission_id",
        method: "DELETE",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "permission"
            },
            {
                name: "method",
                value: "delete"
            }
        ]
    },
    {
        name: "get_all_roles",
        description: "Endpoint to Get all the Roles",
        endpoint: "/api/v1/getAllRoles",
        method: "GET",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "role"
            },
            {
                name: "method",
                value: "get"
            }
        ]
    },
    {
        name: "get_roles_by_passing_hints",
        description: "Endpoint to Get the Roles by passing Hints",
        endpoint: "/api/v1/getRoles/:key/:key_hint",
        method: "GET",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "role"
            },
            {
                name: "method",
                value: "get"
            }
        ]
    },
    {
        name: "update_role",
        description: "Endpoint to Update a Role",
        endpoint: "/api/v1/updateRole",
        method: "PUT",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "role"
            },
            {
                name: "method",
                value: "put"
            }
        ]
    },
    {
        name: "create_role",
        description: "Endpoint to Create a Role",
        endpoint: "/api/v1/createRole",
        method: "POST",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "role"
            },
            {
                name: "method",
                value: "post"
            }
        ]
    },
    {
        name: "delete_role_by_passing_id",
        description: "Endpoint to Delete an existing Role",
        endpoint: "/api/v1/deleteRole/:role_id",
        method: "DELETE",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "role"
            },
            {
                name: "method",
                value: "delete"
            }
        ]
    },
    {
        name: "change_user_state",
        description: "Endpoint to Update the User status",
        endpoint: "/api/v1/changeUserState",
        method: "PUT",
        is_depricated: false,
        tags: [
            {
                name: "model",
                value: "user"
            },
            {
                name: "method",
                value: "put"
            }
        ]
    }
];


async function createEndpoints(server, port, authToken){
        const createEndpointUrl = `http://${server}:${port}/api/v1/createEndpoint`;
        console.log(`[ DEBUG ] Server Endpoint : ${createEndpointUrl}`);
        // Create Endpoints
        console.log(`[ DEBUG ] Server Responses`);
        endpoints.forEach( async endpoint => {
            try {
                let response = await axios.post(createEndpointUrl, endpoint, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                        'content-type': 'application/json'
                    }
                });
                console.log(response.data);
            } catch (error) {
                console.error(`[ ERROR ] ${error}`);
            }
            
        });    
}

module.exports = {
    createEndpoints
}