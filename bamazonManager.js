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

function viewProducts() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        console.table(res);
        selectActivity();
    });
}

function viewLow() {
    connection.query('SELECT * FROM products WHERE stock_quantity <=4', function (err, res) {
        if (err) throw err;
        if (res.length < 1) {
            console.log('No low inventory');
        } else {
            console.table(res);
            // res.forEach(function (elem) {
            //     console.log(elem);
            // });
        }
        selectActivity();
    });
}

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

function getProdQty(prod, qty) {
    connection.query('SELECT stock_quantity FROM products WHERE ?', {
        product_name: prod
    }, function (err, res) {
        if (err) throw err;
        var currentQty = res[0].stock_quantity;
        addInventory(prod, qty, currentQty);
    });
}

function addInventory(prod, qty, currentQty) {
    var updateQty = qty + currentQty;
    // console.log(prod, qty, currentQty, updateQty);
    connection.query('UPDATE products SET ? WHERE ?', [{
        stock_quantity: updateQty
    }, {
        product_name: prod
    }], function (err, res) {
        console.log('Updated!');
        selectActivity();
    });
}

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
    });
    selectActivity();
}