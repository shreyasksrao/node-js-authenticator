const { Pool } = require('pg');

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

module.exports = {
    connectToDB,
}

