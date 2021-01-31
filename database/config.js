const mysql = require('mysql');

const dbConnection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  //password: '',
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConnection);

module.exports = { pool };
