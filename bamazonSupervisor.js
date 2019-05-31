var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});


function menuOptions () {
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "action"
        }
    ]).then(function(response) {
        switch (response.action) {
            case "View Product Sales by Department":
                viewSales();
                break;

            case "Create New Department":
                console.log("new dept");
                createDept();
                break;
        }
    });
}



function viewSales() {

    var query = "SELECT department_id, departments.department_name, over_head_costs, product_sales ";
    query += "FROM departments INNER JOIN products ON (departments.department_name = products.department_name)"
    // query += "WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

    connection.query(query, function (err, res) {
        // display results
        console.log(res);

        menuOptions();
    });


    // row 1
    console.log("| department_id | department_name | over_head_costs | product_sales | total_profit |");

    // row 2
    console.log("| ------------- | --------------- | --------------- | ------------- | ------------ |");

    // row 3
    console.log();
    // | 01            | Electronics     | 10000           | 20000         | 10000        |
    

    // ALTER TABLE departments DROP primary key, ADD primary key(department_name);

}



function createDept() {


}




// connect and start
connection.connect(function (error) {
    if (error) throw error;
    menuOptions();
});



// 4. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

// 5. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

// 6. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.

// * Hint: You may need to look into aliases in MySQL.

// * Hint: You may need to look into GROUP BYs.

// * Hint: You may need to look into JOINS.

// * **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)
