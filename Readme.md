# Authentication application written in Node JS

## Backend Features

1. Written in Express JS as the API framework
2. Uses PostgreSQL as the database
3. Sequelize JS ORM for DB handling in the JS
4. API documentation in swagger-jsdoc
5. Log management using Winston JS
6. Redis as the Caching engine

## Edit the Environment file

Details about the PostgreSQL server, Redis server, JWT token specifications etc. is stored in the config.env file.

Rename the config.template.env(*backend/config/config.template.env*) file to config.env

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

Update the environment file with the correct values.
TOKEN_SIGNING_PRIVATE_KEY="rsa_private_key.key"
TOKEN_SIGNING_PUBLIC_KEY="rsa_public_key.key"

## How to run the Express server

```bash
cd authenticator/backend
npm install
```
