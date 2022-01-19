INSERT INTO departments (id, department_name)
VALUES
  (1, 'Management'),
  (2, 'Human Resources'),
  (3, 'Research'),
  (4, 'Finance'),
  (5, 'Customer Service');

  INSERT INTO roles (title, salary, departments_id)
  VALUES
  ('Manager', 120000, 1),
  ('Talent Management', 50000, 2),
  ('Researcher', 70000, 3),
  ('Accountant', 80000, 4),
  ('Associate', 45000, 5);

  INSERT INTO employees (first_name, last_name, roles_id, manager_id)
  VALUES
  ('Mortimer', 'Goth', 1, NULL),
  ('Bella', 'Goth', 2, NULL),
  ('Cassandra', 'Goth', 3, 2),
  ('Gunter', 'Goth', 4, 1),
  ('Cornelia', 'Goth', 5, 2);
