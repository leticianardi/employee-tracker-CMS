INSERT INTO department (id, name)
VALUES
  (1, 'Management'),
  (2, 'Human Resources'),
  (3, 'Research'),
  (4, 'Finance'),
  (5, 'Customer Service');

  INSERT INTO roles (title, salary, department_id, department_name)
  VALUES
  ('Manager', 120000, 1, 'Management'),
  ('Talent Management', 50000, 2, 'Human Resources'),
  ('Researcher', 70000, 3, 'Research'),
  ('Accountant', 80000, 4, 'Finance'),
  ('Associate', 45000, 5, 'Customer Service');

  INSERT INTO employees (first_name, last_name, roles_id, manager_id)
  VALUES
  ('Mortimer', 'Goth', 1, NULL),
  ('Bella', 'Goth', 2, NULL),
  ('Cassandra', 'Goth', 3, 2),
  ('Gunter', 'Goth', 4, 1),
  ('Cornelia', 'Goth', 5, 2);
