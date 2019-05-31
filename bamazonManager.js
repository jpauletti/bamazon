var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});


var toDisplay = [];



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
            console.log(res[i].item_id + " | " + res[i].product_name + " | $" + res[i].price + " | Inventory: " + res[i].stock_quantity);

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
        if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {

                console.log(res[i].item_id + " | " + res[i].product_name + " | Inventory: " + res[i].stock_quantity);
            }
        } else {
            console.log("No items are low on inventory.");
        }
        

        menuOptions();
    });
}




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




function addNewProduct() {

    inquirer.prompt([
        {
            message: "Enter Product Name:",
            name: "name"
        },
        {
            message: "What department is this product in?",
            name: "department"
        },
        {
            message: "What's the price?",
            name: "price"
        },
        {
            message: "What is this product's stock quantity?",
            name: "stock"
        }
    ]).then(function (response) {
        var product = response.name;
        var department = response.department;
        var numPrice = Number(response.price);
        var stock = response.stock;
        

        // add to DB
        var newItem = product + '", "' + department + '", "' + numPrice + '", "' + stock;
        var query = 'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("' + newItem + '")';

        connection.query(query, function (err, res) {
            if (err) throw err;
            console.log("New Product '" + product + "' added.");

            // show menu again
            menuOptions();
        })
    })

}






// connect and start
connection.connect(function (error) {
    if (error) throw error;
    menuOptions();
});


