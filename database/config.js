const mysql = require('mysql');

const dbConnection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  //password: '',
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
};

const pool = mysql.createPool(dbConnection);

module.exports = { pool };
