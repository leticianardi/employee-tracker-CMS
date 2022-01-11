require('dotenv').config();

const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

// const connection = require('./connection');

// Connect to database
const database = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'abobora.BRANCA12',
    database: 'company_db'
  },
  console.log(`Connected to employees database.`)
);

// opening questions
function menu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'menuQuestions',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'Add department',
          'View roles',
          'Add role',
          'View employess',
          'Add employee',
          'Update employee',
          'Exit'
        ]
      }
    ])
    .then(function (answers) {
      switch (answers.menuQuestions) {
        case 'View all departments':
          allDepartments();
          break;

        case 'Add department':
          addDepartment();
          break;

        case 'View roles':
          allRoles();
          break;

        case 'Add role':
          addRole();
          break;

        case 'View employess':
          allEmployees();
          break;

        case 'Add employee':
          addEmployee();
          break;

        case 'Update employee':
          updateEmployee();
          break;

        case 'Exit':
          database.end();
          break;
      }
    });
}

menu();
