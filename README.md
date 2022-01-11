# employee-tracker-CMS

npm i mysql2 inquirer console.table dotenv

start the application

view all departments,
view all roles,
view all employees,
add a department,
add a role,
add an employee,
update an employee role

-> view all departments
table shows department names and department ids

-> view all roles
job title, role id, the department that role belongs to, and the salary for that role

->view all employees
table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
