-- Seed admin accounts
INSERT INTO admins (id, username, password, name) VALUES
  ('1', 'admin', 'admin123', 'Admin User'),
  ('2', 'manager', 'manager123', 'Manager')
ON CONFLICT (id) DO NOTHING;

-- Seed employees
INSERT INTO employees (id, name, phone, role, salary, address, status) VALUES
  ('1', 'Ahmad Khan', '03001234567', 'Manager', 50000, 'Karachi', 'active'),
  ('2', 'Fatima Ali', '03009876543', 'Staff', 25000, 'Karachi', 'active')
ON CONFLICT (id) DO NOTHING;

-- Seed customers
INSERT INTO customers (id, name, phone, address, total_transactions) VALUES
  ('1', 'Hassan Ahmed', '03101234567', 'Clifton', 5),
  ('2', 'Zainab Khan', '03109876543', 'Defence', 3)
ON CONFLICT (id) DO NOTHING;

-- Seed transactions
INSERT INTO transactions (id, customer_id, employee_id, weight, order_date, collection_date, amount_to_pay, amount_paid, balance, status) VALUES
  ('1', '1', '1', 5, '2025-01-15', '2025-01-17', 500, 500, 0, 'completed'),
  ('2', '2', '2', 3, '2025-01-16', '2025-01-18', 300, 0, 300, 'pending')
ON CONFLICT (id) DO NOTHING;

-- Seed salary payments
INSERT INTO salary_payments (id, employee_id, amount, payment_date) VALUES
  ('1', '1', 50000, '2025-01-01')
ON CONFLICT (id) DO NOTHING;
