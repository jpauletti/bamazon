var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

// mysql connection
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
                createDept();
                break;
        }
    });
}



function viewSales() {
    var query = 'SELECT department_id, departments.department_name, over_head_costs, any_value(SUM(product_sales)) AS product_sales, any_value(over_head_costs - product_sales) AS "total profit" ';
    query += "FROM departments INNER JOIN products ON(departments.department_name = products.department_name) ";
    query += "GROUP BY department_id, department_name, over_head_costs ";
    query += "ORDER BY department_id";

    // make table
    var table = new Table({
        head: ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"],
        colWidths: [15, 20, 20, 15, 15]
    });


    connection.query(query, function (err, res) {
        console.log(res);
        // var count = 0;
        for (var i = 0; i < res.length; i++) {
            var deptID = res[i].department_id;
            var deptName = res[i].department_name;
            var ohCosts = res[i].over_head_costs;
            var productSales = res[i].product_sales;
            var totalProfit = res[i]["total profit"];

            // add results to table
            table.push(
                [deptID, deptName, ohCosts, productSales, totalProfit]
            );
            // console.log(count);

            // if (count === (res.length - 1)) {
            //     console.log(table.toString());
            // }

            // count++;
        }
        // console.log the full table
        console.log(table.toString());
        menuOptions();
    });
}



function createDept() {
    // get dept details
    inquirer.prompt([
        {
            message: "What's the department name?",
            name: "departmentName"
        },
        {
            message: "What are the overhead costs for this department?",
            name: "overhead",
            validate: function (value) {
                if (Number(value) === NaN) {
                    return "Please enter a number.";
                } else {
                    return true;
                }
            }
        }
    ]).then(function(answers) {
        var deptName = answers.departmentName;
        var overhead = answers.overhead;

        var query = "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)";
        var insert = [deptName, overhead];
        // add new department to DB
        connection.query(query, insert, function (err, res) {
            console.log(deptName + " Department has been added.");
            menuOptions();
        });
    });
}




// connect and start
connection.connect(function (error) {
    if (error) throw error;
    menuOptions();
});