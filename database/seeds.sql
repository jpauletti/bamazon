USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Microphone Stand", "Music Equipment", 40.00, 25),
("Condenser Microphone", "Music Equipment", 300.00, 20),
("Women's Blue V-Neck", "Clothing", 20.00, 50)
("iPhone", "Electronics", 800.00, 650)
("Apple Watch", "Electronics", 350.00, 300)
("Black Sweatshirt", "Clothing", 30.00, 45)
("Guitar Picks (pack of 12)", "Music Equipment", 15.00, 60)
("Vans Sneakers", "Clothing", 55.00, 75)
("AirPods", "Electronics", 150.00, 600);


INSERT INTO departments (department_name, over_head_costs)
VALUES ("Clothing", "10000"),
("Electronics", "20000"),
("Music Equipment", "30000");