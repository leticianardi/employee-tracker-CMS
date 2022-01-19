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
      let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
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
