const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
const { eventNames } = require("./db/connection");

// connect js files that hold queries
// const viewEmployee = require("./lib/employeeQueries");
// const { viewRoles, addRole } = require("./lib/roleQueries");
// const { viewDepartments, addDepartment } = require("./lib/departmentQueries");

// function to populate main questions
async function askQuestions() {
    const { questions } = await inquirer.prompt({
        type: "list",
        name: "questions",
        message: "Please select an option:",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update employee role", "Quit"]
    });
    switch (questions) {
        case "View all departments":
            viewDepartments()
            break;
        case "View all roles":
            viewRoles();
            break;
        case "View all employees":
            viewEmployee();
            break;
        case "Add a department":
            addDepartmentQuestions();
            break;
        case "Add a role":
            addRole();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Update employee role":
            updateEmployeeQuestions();
            break;
        default:
            process.exit();
    }
};

// Department Functions

// get all departments
async function viewDepartments() {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        // console.log("VIEW ALL ROLES");
        console.log("===================");
        console.table(rows);
        console.log("===================");
        askQuestions();
    });
};


// add a department prompt
async function addDepartmentQuestions() {
    const departmentName = await inquirer.prompt({
        type: "input",
        name: "department_name",
        message: "What is the new department name?"
    }).then(answer => {
        return addDepartment(answer);
    })
};

// function to create new department
async function addDepartment(answer) {
    const sql = `INSERT INTO departments (department_name) VALUES (?)`;
    const params = [answer.department_name];

    db.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log(params);
        console.log("===================");
        console.table("You have added a new department!");
        console.log("===================");
        askQuestions();
    });
}

// Role Functions

// view all roles route
async function viewRoles() {
    const sql = `SELECT roles.title, roles.id, departments.department_name AS department, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log("===============================================");
        console.table(rows);
        console.log("===============================================");
        askQuestions();
    });
}
// add a role
async function addRole() {
    const departmentInfo = await db.promise().query(`SELECT * FROM departments`);
    let deptList = departmentInfo[0].map((names) => {
        return {
            name: names.department_name,
            value: names.id
        }
    })
    const roleInfo = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the new role title?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the roles salary?"
        },
        {
            type: "list",
            name: "department",
            message: "What department does this role belong to?",
            choices: deptList
        }
    ]);
    // function to create new role
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
    const params = [roleInfo.title, roleInfo.salary, roleInfo.department];
    await db.promise().query(sql, params);
    console.log("===================");
    console.table(`The position of ${roleInfo.title} has been added!`);
    console.log("===================");
    askQuestions();
};



// Employee functions

// get all employees
async function viewEmployee() {
    const sql = `SELECT employees.id, 
                    employees.first_name, 
                    employees.last_name, 
                    roles.title AS title,
                    departments.department_name AS department,
                    roles.salary,
                    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                 FROM employees
                 LEFT JOIN employees manager on manager.id = employees.manager_id
                 LEFT JOIN roles ON employees.role_id = roles.id
                 LEFT JOIN departments ON departments.id = roles.department_id`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log("========================================================================================");
        console.table(rows);
        console.log("========================================================================================");
        askQuestions();
    });
};

// add an employee
async function addEmployee() {
    const managerInfo = await db.promise().query(`SELECT * FROM employees WHERE manager_id IS NULL;`);
    let managerList = managerInfo[0].map((names) => {
        return {
            name: names.first_name.concat(" ", names.last_name),
            value: names.id
        }
    });
    const rolesInfo = await db.promise().query(`SELECT * FROM roles`);
    let rolesList = rolesInfo[0].map((role) => {
        return {
            name: role.title,
            value: role.id
        }
    });
    console.log(managerList);
    const newEmployee = await inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the new employees first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the new employees last name?"
        },
        {
            type: "list",
            name: "role",
            message: "What role does the new employee have?",
            choices: rolesList
        },
        {
            type: "list",
            name: "manager",
            message: "Who is your new employee's manager?",
            choices: managerList
        }

    ]);

    // function to create new employee in database
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
    const params = [newEmployee.first_name, newEmployee.last_name, newEmployee.role, newEmployee.manager];
    console.log(newEmployee.manager);
    await db.promise().query(sql, params);
    console.log("========================================================================================");
    console.table(`The employee of ${newEmployee.first_name} ${newEmployee.last_name} has been added!`);
    console.log("========================================================================================");
    askQuestions();
};

// Update employee role
async function updateEmployeeQuestions() {
    const employeeInfo = await db.promise().query(`SELECT * FROM employees`);
    let employeeList = employeeInfo[0].map((name) => {
        return {
            name: name.first_name.concat(" ", name.last_name),
            value: name.id
        }
    });
    const rolesInfo = await db.promise().query(`SELECT * FROM roles`);
    let roleList = rolesInfo[0].map((role) => {
        return {
            name: role.title,
            value: role.id
        }
    });

    const { employeeId, roleId } = await inquirer.prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to update?",
            choices: employeeList
        },
        {
            type: "list",
            name: "roleId",
            message: "What is their new role?",
            choices: roleList
        }
    ]);
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
    const params = [roleId, employeeId];
    await db.promise().query(sql, params);
    console.log("===================");
    console.log("Successfully updated the employee role!");
    console.log("===================");
    askQuestions();
}

function init() {
    console.log("===================");
    console.log("Welcome to the Employee Tracker!")
    console.log("===================");
    askQuestions();
}

init()