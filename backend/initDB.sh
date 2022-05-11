#!/bin/bash
set -e

auth_db="$AUTH_DB";
auth_db_user="$AUTH_DB_USER";
auth_db_user_password="$AUTH_DB_USER_PASSWORD";
auth_schema="$AUTH_SCHEMA";

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER $auth_db_user WITH PASSWORD '$auth_db_user_password';
    CREATE DATABASE $auth_db;
    GRANT ALL PRIVILEGES ON DATABASE $auth_db TO $auth_db_user;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$auth_db_user" --dbname "$auth_db" <<-EOSQL
    CREATE SCHEMA $auth_schema;
EOSQL