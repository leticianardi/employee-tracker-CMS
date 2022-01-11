INSERT INTO department (id, name)
VALUES
  (1, 'Management'),
  (2, 'Research'),
  (3, 'Finance'),
  (4, 'Customer Service'),
  (5, 'Human Resources');

  INSERT INTO roles (title, salary, department_id)
  VALUES
  ('Manager', 90000, 1),
  ('Researcher', 70000, 2),
  ('Accountant', 80000, 3),
  ('Associate', 45000, 4),
  ('Talent Management', 50000, 5);

  INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES
  ('Mortimer', 'Goth', 1, NULL)
  ('Bella', 'Goth', 2, 1)
  ('Cassandra', 'Goth', 3, 1)
  ('Gunter', 'Goth', 4, 5)
  ('Cornelia', 'Goth', 5, 2)