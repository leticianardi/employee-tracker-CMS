const mysql = require('mysql2');
// const connection = require('sequelize');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
