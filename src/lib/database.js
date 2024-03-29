// dbPool.js
const { Pool } = require('pg');
require('dotenv').config();

const dbPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

module.exports = dbPool;
