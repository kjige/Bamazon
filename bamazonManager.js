var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon'
});

selectActivity();

// manager selects what activity to do
function selectActivity() {
    inquirer.prompt([{
        name: 'options',
        type: 'list',
        message: 'Select',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function (res) {
        switch (res.options) {
        case 'View Products for Sale':
            viewProducts();
            break;
        case 'View Low Inventory':
            viewLow();
            break;
        case 'Add to Inventory':
            getInventory();
            break;
        case 'Add New Product':
            addNewProduct();
            break;
        }
    });
}

// views all products in a table
function viewProducts() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        console.table(res);
        selectActivity();
    });
}

// view products that are low in stock quantity
function viewLow() {
    connection.query('SELECT * FROM products WHERE stock_quantity <=4', function (err, res) {
        if (err) throw err;
        if (res.length < 1) {
            console.log('No low inventory');
        } else {
            console.table(res);
        }
        selectActivity();
    });
}

// gets list of product names
function getInventory() {
    connection.query('SELECT product_name FROM products', function (err, res) {
        if (err) throw err;
        var prodsArr = [];
        for (var i = 0; i < res.length; i++) {
            prodsArr.push(res[i].product_name);
        }
        listInventory(prodsArr);
    });
}

// displays product list for manager to choose from and asks for quantity to add
function listInventory(prodsArr) {
    inquirer.prompt([{
        name: 'product',
        message: 'Select product:',
        type: 'list',
        choices: prodsArr
    }, {
        name: 'quant',
        message: 'add how many?',
        type: 'input'
    }]).then(function (res) {
        var prod = res.product;
        var qty = parseInt(res.quant);
        getProdQty(prod, qty);
    });
}

// get the current quantity of selected product
function getProdQty(prod, qty) {
    connection.query('SELECT stock_quantity FROM products WHERE ?', {
        product_name: prod
    }, function (err, res) {
        if (err) throw err;
        var currentQty = res[0].stock_quantity;
        addInventory(prod, qty, currentQty);
    });
}

// add the additional quantity to current quantity
function addInventory(prod, qty, currentQty) {
    var updateQty = qty + currentQty;
    connection.query('UPDATE products SET ? WHERE ?', [{
        stock_quantity: updateQty
    }, {
        product_name: prod
    }], function (err, res) {
        console.log('Updated!');
        selectActivity();
    });
}

// asks manager for information about the new product
function addNewProduct() {
    inquirer.prompt([{
        name: 'productName',
        message: 'What is the product name?',
        type: 'input'
    }, {
        name: 'department',
        message: 'Which department?',
        type: 'input'
    }, {
        name: 'price',
        message: 'What is the unit price?',
        type: 'input'
    }, {
        name: 'quantity',
        message: 'What is the quantity?',
        type: 'input'
    }]).then(function (res) {
        var prod = res.productName;
        var dept = res.department;
        var itemPrice = parseFloat(res.price);
        var quant = parseInt(res.quantity);
        insertProduct(prod, dept, itemPrice, quant);
    });
}

// add new product to table
function insertProduct(prod, dept, itemPrice, quant) {
    connection.query('INSERT INTO products SET ?', {
        product_name: prod,
        department_name: dept,
        price: itemPrice,
        stock_quantity: quant
    });
    console.log('Item added!');
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        console.table(res);
        selectActivity();
    });
}