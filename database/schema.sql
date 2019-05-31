DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(75),
    department_name VARCHAR(75),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(50) DEFAULT 0,
    product_sales DECIMAL(15, 2) DEFAULT 0,
    PRIMARY KEY (item_id)
);


CREATE TABLE departments (
    department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(75),
    over_head_costs INT(50) NOT NULL,
    PRIMARY KEY (department_id)
);