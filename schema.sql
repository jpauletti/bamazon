-- 1. Create a MySQL Database called `bamazon`.

-- 2. Then create a Table inside of that database called `products`.

-- 3. The products table should have each of the following columns:

-- * item_id (unique id for each product)

-- * product_name (Name of product)

-- * department_name

-- * price (cost to customer)

-- * stock_quantity (how much of the product is available in stores)

-- 4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(75),
    department_name VARCHAR(75),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(50) DEFAULT 0,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Microphone Stand", "Music Equipment", 40.00, 25),
("Condenser Microphone", "Music Equipment", 300.00, 20),
("Women's Blue V-Neck", "Women's Clothing", 20.00, 50);

SELECT * FROM products;