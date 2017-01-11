var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

// connection.connect(function (err) {
//     if (err) throw err;
//     console.log('Bamazon!');
// });

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
    // console.log(prodID + ' ' + qty);
    checkItem(prodID, qty);
});

function checkItem(prodID, qty) {
    connection.query('SELECT stock_quantity FROM products WHERE ?', {
        item_ID: prodID
    }, function (err, res) {
        var stockQty = res[0].stock_quantity;
        // console.log(res[0].stock_quantity);
        if (err) throw err;
        if (stockQty > qty) {
            // console.log('Stock available!' + stockQty + ' ' + qty);
            updateDB(prodID, qty, stockQty);
        } else {
            console.log('Insufficient quantity! ' + stockQty + ' ' + qty);
        }
    });
}

function updateDB(prodID, qty, stockQty) {
    var newStockQty = stockQty - qty;
    connection.query('UPDATE products SET ? WHERE ?', [{
        stock_quantity: newStockQty
    }, {
        item_ID: prodID
    }], function (err, res) {
        console.log('newStockQty ' + newStockQty);
        calcPrice(prodID, qty);
    });
}

function calcPrice(prodID, qty) {
    connection.query('SELECT price FROM products WHERE ?', {
        item_ID: prodID
    }, function (err, res) {
        var price = res[0].price;
        var total = price * qty;
        if (err) throw err;
        // console.log(res);
        console.log('Your total is $' + total + '!');
    });
}