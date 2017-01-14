var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

// create connection to database
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

// ask user what product to purchase and quantity
inquirer.prompt([{
    name: 'productID',
    message: 'what is the product ID?',
    type: 'input'
}, {
    name: 'quantity',
    message: 'how many would you like?',
    type: 'input'
}]).then(function (resp) {
    var prodID = resp.productID;
    var qty = parseInt(resp.quantity);
    displayProduct(prodID);
    checkItem(prodID, qty);
});

// display purchased item with updated stock quantity
function displayProduct(prodID) {
    connection.query('SELECT * FROM products WHERE ?', {
        item_ID: prodID
    }, function (err, res) {
        if (err) throw err;
        console.table(res);
    });
}

// check database for stock quantity for specific product
function checkItem(prodID, qty) {
    connection.query('SELECT stock_quantity FROM products WHERE ?', {
        item_ID: prodID
    }, function (err, res) {
        if (err) throw err;
        var stockQty = res[0].stock_quantity;
        checkStock(prodID, stockQty, qty);
    });
}

// check if there is enough stock quantity
function checkStock(prodID, stockQty, qty) {
    if (stockQty > qty) {
        console.log('Stock available!');

        updateDB(prodID, qty, stockQty);
    } else {
        console.log('Insufficient quantity!');
    }
}

// update database with new stock quantity after purchase
function updateDB(prodID, qty, stockQty) {
    var newStockQty = stockQty - qty;
    connection.query('UPDATE products SET ? WHERE ?', [{
        stock_quantity: newStockQty
    }, {
        item_ID: prodID
    }], function (err, res) {
        if (err) throw err;
        calcPrice(prodID, qty);
    });
}

// calculate and display purchase price
function calcPrice(prodID, qty) {
    connection.query('SELECT price FROM products WHERE ?', {
        item_ID: prodID
    }, function (err, res) {
        if (err) throw err;
        var price = res[0].price;
        var total = price * qty;
        console.log('Your total is $' + total + '!');
        displayProduct(prodID);
    });
}