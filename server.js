const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
const res = require('express/lib/response');
const { listenerCount, title } = require('process');

require('dotenv').config();
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
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
          'View all roles',
          'View all employess',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Delete a department',
          'Delete a role',
          'Delete an employee',
          'Exit menu'
        ]
      }
    ])
    .then(function (answers) {
      switch (answers.menuQuestions) {
        case 'View all departments':
          allDepartments();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'View all roles':
          allRoles();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'View all employess':
          allEmployees();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployee();
          break;

        case 'Delete a department':
          deleteDepartment();
          break;

        case 'Delete a role':
          deleteRole();
          break;

        case 'Delete an employee':
          deleteEmployee();
          break;

        case 'Exit menu':
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
  const sql = `SELECT
                roles.id,
                roles.title,
                roles.salary,
                roles.departments_id,
                departments.department_name
              FROM roles
              JOIN departments
                ON departments.id = roles.departments_id`;

  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    menu();
  });
}

function allEmployees() {
  const sql = `SELECT 
                employees.id, 
                employees.first_name, 
                employees.last_name, 
                roles.title, 
                roles.salary, 
                departments.department_name AS department, 
                CONCAT(managers.first_name, ' ', managers.last_name) AS manager
              FROM employees
              LEFT JOIN roles
                ON employees.roles_id = roles.id
              LEFT JOIN departments
                ON departments.id = roles.departments_id
              LEFT JOIN employees managers
                ON managers.id = employees.manager_id`;

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
      connection.query(sql, { department_name: res.name }, (err, res) => {
        if (err) throw err;
      });
      const showTable = `SELECT * FROM departments`;
      connection.query(showTable, (err, res) => {
        if (err) throw err;
        console.log('Added department to the database');
        menu();
      });
    });
}

function addRole() {
  connection
    .promise()
    .query('SELECT * FROM departments')
    .then((res) => {
      return res[0].map((department) => {
        return {
          value: department.id,
          name: department.department_name
        };
      });
    })
    .then((department) => {
      return inquirer.prompt([
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
            return 'Please enter a valid salary.';
          }
        },
        {
          type: 'list',
          name: 'department',
          message: 'Select the department name: ',
          choices: department
        }
      ]);
    })

    .then((answer) => {
      return connection.promise().query('INSERT INTO roles SET ?', {
        title: answer.title,
        salary: answer.salary,
        departments_id: answer.department
      });
    })

    .then((res) => {
      console.log('Added role to the database');
      menu();
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
    .then((answers) => {
      const sql = `INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?,?,?,?)`;
      const params = [
        answers.firstName,
        answers.lastName,
        answers.roleId,
        answers.managerId
      ];

      connection.query(sql, params, (err, res) => {
        if (err) throw err;
        console.log('Added employee to the database');
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
                console.log('Updated employee in the database');
                menu();
              });
            });
        });
      });
  });
}

function deleteEmployee() {
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
          name: 'employee',
          message: 'Choose an employee to delete:',
          choices: employee
        }
      ])
      .then((answer) => {
        const sql = `DELETE FROM employees WHERE id = ?`;
        const params = [answer.employee];
        connection.query(sql, params, (err, res) => {
          if (err) throw err;
          console.log('Deleted employee from the database');
          menu();
        });
      });
  });
}

function deleteDepartment() {
  const sql = `SELECT * FROM departments`;

  connection.query(sql, (err, res) => {
    if (err) throw err;
    const department = res.map(({ id, department_name }) => ({
      value: id,
      name: `${department_name}`
    }));
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'department',
          message: 'Choose a department to delete.',
          choices: department
        }
      ])
      .then((answer) => {
        const sql = `DELETE FROM departments WHERE id = ?`;
        const params = [answer.department];
        connection.query(sql, params, (err, res) => {
          if (err) throw err;
          console.log('Deleted department from the database');
          menu();
        });
      });
  });
}

function deleteRole() {
  const sql = `SELECT * FROM roles`;

  connection.query(sql, (err, res) => {
    if (err) throw err;
    const role = res.map(({ id, title, salary, departments_id }) => ({
      value: id,
      name: `${title}`,
      salary: `${salary}`,
      dpto: `${departments_id}`
    }));
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'role',
          message: 'Choose a role to delete.',
          choices: role
        }
      ])
      .then((answer) => {
        const sql = `DELETE FROM roles WHERE id = ?`;
        const params = [answer.role];
        connection.query(sql, params, (err, res) => {
          if (err) throw err;
          console.log('Deleted role from the database');
          menu();
        });
      });
  });
}

menu();
