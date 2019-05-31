USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Microphone Stand", "Music Equipment", 40.00, 25),
("Condenser Microphone", "Music Equipment", 300.00, 20),
("Women's Blue V-Neck", "Women's Clothing", 20.00, 50);


INSERT INTO departments (department_name, over_head_costs)
VALUES ("Clothing", "10000"),
("Electronics", "20000"),
("Music Equipment", "30000");

-- SELECT * FROM products;

SELECT * FROM departments;