const inquirer = require('inquirer');
const table = require('console.table');
const mysql = require('mysql2');
const res = require('express/lib/response');

// require('dotenv').config();
// const connection = require('./connection');

// const connection = mysql.createConnection(
//   {
//     host: process.env.host,
//     user: process.env.user,
//     password: process.env.password,
//     database: process.env.database
//   },
//   console.log('Connected to Company Database')
// );

const connection = mysql.createConnection(
  //acess to database
  {
    host: 'localhost',
    user: 'root',
    password: 'abobora.BRANCA12',
    database: 'company_db'
  },
  console.log('Connected to Company Database')
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
          connection.end();
          break;
      }
    });
}

function allDepartments() {
  const sql = `SELECT * FROM department`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
}

function allRoles() {
  const sql = `SELECT * FROM roles`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
}

function allEmployees() {
  const sql = `SELECT * FROM employees`;
  connection.query(sql, (err, res) => {
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
      connection.query(sql, { name: res.name }, (err, res) => {
        if (err) throw err;
        //console.log(res);
        console.table(res);
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
        message: 'Insert role title: '
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Insert role salary: '
      },
      {
        type: 'input',
        name: 'departmentId',
        message: 'Insert department ID number: '
      },
      {
        type: 'input',
        name: 'departmentName',
        message: 'Insert department name: '
      }
    ])
    .then((res) => {
      let sql = `INSERT INTO roles SET ?`;

      connection.query(
        sql,
        {
          title: res.title,
          salary: res.salary,
          department_id: res.departmentId,
          department_name: res.departmentName
        },
        (err, res) => {
          if (err) throw err;
          console.table(res);
          menu();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Insert employee's first name: ",
        validate: (answer) => {
          if (answer !== '') {
            return true;
          }
          return 'Please enter at least one character.';
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Insert employee's last name: ",
        validate: (answer) => {
          if (answer !== '') {
            return true;
          }
          return 'Please enter at least one character.';
        }
      },
      {
        type: 'input',
        name: 'roleId',
        message: "Insert employee's role ID number: ",
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return 'Please enter a valid id.';
        }
      },
      {
        type: 'input',
        name: 'managerId',
        message: "Insert employee's manager ID number: ",
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return 'Please enter a valid id.';
        }
      }
    ])
    .then((res) => {
      let sql = `INSERT INTO employees SET ?`;

      connection.query(
        sql,
        {
          first_name: res.firstName,
          last_name: res.lastName,
          roles_id: res.roleId,
          manager_id: res.managerId
        },
        (err, res) => {
          if (err) throw err;
          console.table(res);
          menu();
        }
      );
    });
}

// function updateEmployee()

// function deleteEmployee()

menu();
