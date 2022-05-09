# Authentication application written in Node JS

## Backend Features:

1. Written in Express JS as the API framework
2. Uses PostgreSQL as the database to store the User details
3. Sequelize JS ORM for DB handling in the JS
4. API documentation using swagger-jsdoc
5. Log management using Winston JS
6. Redis as the Caching engine

## Edit the Environment file:

Details about the PostgreSQL server, Redis server, JWT token specifications etc. is stored in the ***config.env*** file. Express server reads this file to get the details about the components.

Template config file can be found in the config directory(***backend/config/config.template.env***). Rename this template file to ***config.env***  

### Environment Variables:

> AUTH_SERVER_PORT=5001  
> AUTH_SERVER_ENV="development"

Update the Server port and environment(*dev, test, stage, prod*)  

---------

> ISSUER_NAME="authenticator"

Can be used in the *iby* field in the JWT token.

---------

> DB_HOST="localhost"  
> DB_PORT=5432  
> DB_NAME="auth_db"  
> DB_USER="auth_user"  
> DB_PASSWORD="Password for the auth_user"  

Update the PostgreSQL server details.

---------

> REDIS_HOST="Redis Hostname"  
> REDIS_PORT=6379  
> REDIS_PASS="Redis password"  

Update the Redis server details.  

---------

> ACCESS_TOKEN_EXPIRY_SECONDS=1800  
> REFRESH_TOKEN_EXPIRY_SECONDS=1800  

To change the token expiration seconds, update the above 2 properties.  

---------

> TOKEN_SIGNING_PRIVATE_KEY="rsa_private_key.key"  
> TOKEN_SIGNING_PUBLIC_KEY="rsa_public_key.key"

Update the token signing key file name. Place the private and public key file in the keys directory (**backend/config/keys**).

---------

> LOG_LEVEL="debug"

Select the log level (Supported values are [ info, debug, warn, error ]).  
Logs will be stored in the ***backend/logs/server.log***  

## How to run the Express server

```bash
cd authenticator/backend
npm install
```
