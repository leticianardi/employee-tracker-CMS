require('dotenv').config();

const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const res = require('express/lib/response');

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
          'View roles',
          'View employess',
          'Add department',
          'Add role',
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

function allDepartments() {
  const sql = `SELECT * FROM department`;
  database.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
}

function allRoles() {
  const sql = `SELECT * FROM roles`;
  database.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
}

function allEmployees() {
  const sql = `SELECT * FROM employees`;
  database.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Insert department name: '
      }
    ])
    .then((res) => {
      let sql = `INSERT INTO department SET ?`;
      database.query(sql, { name: res.name }, (err, res) => {
        if (err) throw err;
        //console.log(res);
        menu();
      });
    });
}

function addRole(department) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Role title: '
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Role salary: '
      },
      {
        type: 'input',
        name: 'departmentId',
        message: 'Department ID number: '
      }
    ])
    .then((res) => {
      let sql = `INSERT INTO roles SET ?`;

      database.query(
        sql,
        {
          title: res.title,
          salary: res.salary,
          department_id: res.departmentId
        },
        (err, res) => {
          if (err) throw err;
          menu();
        }
      );
    });
}

// addEmployee()
// updateEmployee()

menu();
