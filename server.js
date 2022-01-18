const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const res = require('express/lib/response');
const { listenerCount, title } = require('process');

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
          'Exit menu'
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
  const sql = `SELECT * FROM departments`;
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
        message: 'Insert department name: ',
        validate: (answer) => {
          if (answer !== '') {
            return true;
          }
          return 'Please enter at least one character.';
        }
      }
    ])
    .then((res) => {
      let sql = `INSERT INTO departments SET ?`;
      connection.query(sql, { name: res.name }, (err, res) => {
        if (err) throw err;
      });
      const showTable = `SELECT * FROM departments`;
      connection.query(showTable, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
      });
    });
}

function addRole(departments) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Insert role title: ',
        validate: (answer) => {
          if (answer !== '') {
            return true;
          }
          return 'Please enter at least one character.';
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Insert role annual salary (only numbers): ',
        validate: (answer) => {
          const pass = answer.match(/^[1-9]\d*$/);
          if (pass) {
            return true;
          }
          return 'Please enter a valid number.';
        }
      },
      {
        type: 'input',
        name: 'departmentId',
        message: 'Insert department ID number: ',
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
        name: 'departmentName',
        message: 'Insert department name: ',
        validate: (answer) => {
          if (answer !== '') {
            return true;
          }
          return 'Please enter at least one character.';
        }
      }
    ])
    .then((res) => {
      let sql = `INSERT INTO roles SET ?`;

      connection.query(sql, {
        title: res.title,
        salary: res.salary,
        departments_id: res.departmentId,
        departments_name: res.departmensName
      });
      const showTable = `SELECT * FROM roles`;
      connection.query(showTable, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
      });
    });
}

function addEmployee(departments, roles) {
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
        message: "Insert employee's role ID number: "
      },
      {
        type: 'input',
        name: 'managerId',
        message: "Insert employee's manager ID number: "
      }
    ])
    .then((res) => {
      let sql = `INSERT INTO employees SET ?`;
      connection.query(sql, {
        first_name: res.firstName,
        last_name: res.lastName,
        roles_id: res.roleId,
        manager_id: res.managerId
      });

      const showTable = `SELECT 
                          employees.id,
                          employees.first_name,
                          employees.last_name,
                          roles.title,
                          roles.salary,
                          departments.department_name
                        FROM employees
                        JOIN roles
                          ON roles_id = roles.id
                        JOIN departments
                          ON departments.id = roles.departments_id
                        ORDER BY departments_id`;
      connection.query(showTable, (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
      });
    });
}

function updateEmployee() {
  const sql = `SELECT * FROM employees`;

  connection.query(sql, (err, res) => {
    if (err) throw err;
    const employee = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`
    }));
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'title',
          message: 'Choose the employee you would like to update:',
          choices: employee
        }
      ])
      .then((answers) => {
        const sql = `SELECT * FROM roles`;
        connection.query(sql, (err, res) => {
          if (err) throw err;
          const role = res.map(({ id, title, salary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`,
            name: `${title}`
          }));
          return inquirer
            .prompt([
              {
                type: 'list',
                name: 'role',
                message: "Choose employee's new role",
                choices: role
              }
            ])
            .then((ans) => {
              const sql = `UPDATE employees SET roles_id = ? WHERE id = ?`;
              const params = [ans.role, answers.title];

              connection.query(sql, params, (err, res) => {
                if (err) throw err;
                console.table(res);
                menu();
              });
            });
        });
      });
  });
}
// function deleteEmployee()

menu();
