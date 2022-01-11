const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

connection.connect(function (err) {
  if (err) throw err;
  else {
    console.log('Connected to the company database.');
  }
});

module.exports = connection;
