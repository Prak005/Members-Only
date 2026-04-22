const { Pool } = require('pg');

module.exports = new Pool ({
    host: process.env.DB_HOST,
    user: process.env.DB_NAME,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});