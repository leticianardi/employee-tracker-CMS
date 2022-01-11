require('dotenv').config();

const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

// const connection = require('./connection');

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'abobora.BRANCA12',
    database: 'company_db'
  },
  console.log(`Connected to employees database.`)
);
