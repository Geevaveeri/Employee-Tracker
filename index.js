const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");

// connect js files that hold queries
const viewEmployee = require("./lib/employeeQueries");
const { viewRoles, addRole } = require("./lib/roleQueries");
const { viewDepartments, addDepartment } = require("./lib/departmentQueries");


// Start DB connection
db.connect(err => {
    if (err) throw err;
    console.log("Database connected.");
});