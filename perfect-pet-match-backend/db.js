const { Client } = require('pg');
require('dotenv').config();

// Retrieve database connection information from environment variables
const dbConfig = {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

const db = new Client(dbConfig);

db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Error connecting to the database', err));

module.exports = db;
