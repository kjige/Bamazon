CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
	department_name VARCHAR(200) NOT NULL,
	price DECIMAL(6,2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES 
(10, 'average table', 'furniture', 200.00, 20),
(9, 'nice table', 'furniture', 500.00, 10),
(8, 'average mattress', 'bed', 600.00, 25),
(7, 'nice mattress', 'bed', 1200.00, 15),
(6, 'average pants', 'clothes', 25.00, 30),
(5, 'nice pants', 'clothes', 65.00, 25),
(4, 'average shirt', 'clothes', 35.00, 40),
(3, 'nice shirt', 'clothes', 75.00, 25),
(2, 'average shoes', 'shoes', 50.00, 30),
(1, 'nice shoes', 'shoes', 80.00,20);