var mysql = require("mysql");
var inquirer = require("inquirer");


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
    var query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, function (err, res) {
        // display results
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
            
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
        console.log(product_ids);
    });



    inquirer.prompt([
        // The first should ask them the ID of the product they would like to buy.
        {
            message: "Which product would you like to buy? (Choose its ID below)",
            type: "list",
            choices: product_ids,
            name: "productToBuy"
        },
        // The second message should ask how many units of the product they would like to buy.
        {
            message: "How many?",
            validate: function (value) {

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

        // if there is enough stock
        if (selectedProduct.stock_quantity > response.howMany) {
            // function here
            console.log("We have enough for that order!");
        } else {
            // if not enough stock
            // function here
            console.log("Insufficient quantity.");
        }
    });


    

    // ask user what they want to buy
    // inquirer.prompt([
    //     // The first should ask them the ID of the product they would like to buy.
    //     {
    //         message: "Which product would you like to buy? (Choose its ID below)",
    //         type: "list",
    //         choices: product_ids,
    //         name: "productToBuy"
    //     },
    //     // The second message should ask how many units of the product they would like to buy.
    //     {
    //         message: "How many?",
    //         validate: function(value) {

    //         },
    //         name: "howMany"
    //     }
    // ]).then(function(response) {
    //     // do we have enough stock for user's purchase?
    //     // find product info
    //     for (var i = 0; i < products.length; i++) {
    //         if (products[i].item_id === Number(response.productToBuy)) {
    //             selectedProduct = products[i];
    //         }
    //     }

    //     // if there is enough stock
    //     if (selectedProduct.stock_quantity > response.howMany) {
    //         // function here
    //         console.log("We have enough for that order!");
    //     } else {
    //         // if not enough stock
    //         // function here
    //         console.log("Insufficient quantity.");
    //     }
    // });
};



connection.connect(function(error){
    if (error) throw error;
    startUp();
});





//Ask user 2 questions:
    // The first should ask them the ID of the product they would like to buy.
    // The second message should ask how many units of the product they would like to buy.
        // check to see if you have enough
            // if not - "insufficient quantity"
            // if you do
                // update sql db quantity
                // show user total cost of their purchase