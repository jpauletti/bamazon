var mysql = require("mysql");
var inquirer = require("inquirer");

// mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});


var product_ids = [];
var products = [];

var selectedProduct = "";

function startUp () {
    // show all products for sale: display their ids, names, and prices
    console.log("\nCURRENT PRODUCTS FOR SALE");
    console.log("--------------------------------------------");
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function (err, res) {
        // display results
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | $" + res[i].price);
            
            // add ids to an array
            product_ids.push(res[i].item_id);

            var newProduct = {
                item_id: res[i].item_id,
                product_name: res[i].product_name,
                price: res[i].price,
                stock_quantity: res[i].stock_quantity
            }
            // add product info to array as well
            products.push(newProduct);
        }
        whatToBuy();
    });
};



function whatToBuy() {
    console.log("");
    // ask user what they want to buy
    inquirer.prompt([
        // ask user which product they want, and how much of it
        {
            message: "Which product would you like to buy? (Choose its ID below)",
            type: "list",
            choices: product_ids,
            name: "productToBuy"
        },
        {
            message: "How many?",
            validate: function (value) {
                if (Number(value) === NaN) {
                    return "Please enter a number.";
                } else {
                    return true;
                }
            },
            name: "howMany"
        }
    ]).then(function (response) {
        // do we have enough stock for user's purchase?
        // find product info
        for (var i = 0; i < products.length; i++) {
            if (products[i].item_id === Number(response.productToBuy)) {
                selectedProduct = products[i];
            }
        }

        console.log("You requested: " + response.howMany + " | " + "Current Stock: " + selectedProduct.stock_quantity);

        // if there is enough stock
        if (selectedProduct.stock_quantity > response.howMany) {
            makeOrder(selectedProduct.stock_quantity, response.howMany, selectedProduct.item_id);
        } else {
            // if not enough stock
            console.log("Insufficient quantity.");

            // show menu again
            whatToBuy();
        }
    });
};


function makeOrder (currentStock, orderAmount, itemID) {
    // update db quantity and add to product_sales
    var newStock = currentStock - orderAmount;
    var newSales = selectedProduct.price * orderAmount;
    var query = "UPDATE products SET stock_quantity = " + newStock + ", product_sales = product_sales + " + newSales + " WHERE item_id = " + itemID;

    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("Order successful!");

        // show total purchase cost
        console.log("Total Cost: $" + selectedProduct.price * orderAmount);

        // show menu again
        whatToBuy();
    })
}



connection.connect(function(error){
    if (error) throw error;
    startUp();
});

