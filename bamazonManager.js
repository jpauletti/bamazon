
// * List a set of menu options:

//     * View Products for Sale
    
//     * View Low Inventory
    
//     * Add to Inventory
    
//     * Add New Product

// * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

// * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

// * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

// * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

// - - -

// * If you finished Challenge #2 and put in all the hours you were willing to spend on this activity, then rest easy! Otherwise continue to the next and final challenge.


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
var toDisplay = [];

// var selectedProduct = "";






function menuOptions() {
    console.log("");
    // ask user what they want to do
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "action"
        }
    ]).then(function (response) {

        switch (response.action) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addToInventory();
                break;

            case "Add New Product":
                console.log("new product");
                addNewProduct();
                break;

            default:
                console.log("Please select an option from the menu.");
        }




        // for (var i = 0; i < products.length; i++) {
        //     if (products[i].item_id === Number(response.productToBuy)) {
        //         selectedProduct = products[i];
        //     }
        // }

        // console.log("You requested: " + response.howMany + " | " + "Current Stock: " + selectedProduct.stock_quantity);

        // // if there is enough stock
        // if (selectedProduct.stock_quantity > response.howMany) {
        //     // function here
        //     makeOrder(selectedProduct.stock_quantity, response.howMany, selectedProduct.item_id);

        // } else {
        //     // if not enough stock
        //     // function here
        //     console.log("Insufficient quantity.");

        //     // show menu again
        //     whatToBuy();
        // }
    });
};


function viewProducts() {
    // show all products for sale: display their ids, names, and prices, and quantities
    console.log("\nCURRENT PRODUCTS FOR SALE");
    console.log("--------------------------------------------");
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function (err, res) {
        // display results
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | $" + res[i].price + " | Inventory:" + res[i].stock_quantity);

            var newProduct = {
                item_id: res[i].item_id,
                product_name: res[i].product_name,
                price: res[i].price,
                stock_quantity: res[i].stock_quantity
            }
            // add product info to array as well
            // products.push(newProduct);

        }

        menuOptions();
    });
};





function viewLowInventory() {
    console.log("\nPRODUCTS WITH INVENTORY LOWER THAN 5");
    console.log("--------------------------------------------");
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5;";
    connection.query(query, function (err, res) {
        // display results
        for (var i = 0; i < res.length; i++) {

            console.log(res[i].item_id + " | " + res[i].product_name + " | Inventory: " + res[i].stock_quantity);
        }

        menuOptions();
    });
}













// function makeOrder(currentStock, orderAmount, itemID) {
//     // update db quantity
//     var newStock = currentStock - orderAmount;
//     var query = "UPDATE products SET stock_quantity = " + newStock + " WHERE item_id = " + itemID;
//     connection.query(query, function (err, res) {
//         if (err) throw err;
//         console.log("Order successful!");

//         // show total purchase cost
//         console.log("Total Cost: $" + selectedProduct.price * orderAmount);

//         console.log(res.changedRows + " changed stock.");

//         // show menu again
//         whatToBuy();
//     })
// }



function addToInventory() {
    // get list of products
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function (err, res) {
        // display results
        for (var i = 0; i < res.length; i++) {

            var newitem = res[i].item_id + " | " + res[i].product_name + " | $" + res[i].price + " | Inventory:" + res[i].stock_quantity;

            toDisplay.push(newitem);
        }

        console.log("");
        inquirer.prompt([
            {
                message: "Which product would you like to update?",
                type: "list",
                choices: toDisplay,
                name: "product"
            },
            {
                message: "What would you like to change the stock quantity to?",
                validate: function (value) {
                    if (Number(value) === NaN) {
                        return "Please enter a number.";
                    } else {
                        return true;
                    }
                },
                name: "newStock"
            }
        ]).then(function (response) {
            // grab item id
            var itemID = response.product.charAt(0);

            // update stock
            var query = "UPDATE products SET stock_quantity = " + response.newStock + " WHERE item_id = " + itemID;
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log("Stock Quantity Updated.");

                console.log(res.changedRows + " rows updated.");

                // show menu again
                menuOptions();
            })

        });
    });

}








connection.connect(function (error) {
    if (error) throw error;
    menuOptions();
});


