const cTable = require("console.table");
const db = require("../db/connection");

// view all roles route
async function viewRoles(){
    const sql = `SELECT roles.title, roles.id, departments.department_name AS department, roles.salary FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log("VIEW ALL ROLES");
        cTable(rows);
    });
}

// add a role
async function addRole(){
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
    const params = [body.title, body.salary, body.department_id];

    db.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log("ADDED EMPLOYEE");
        cTable(rows);
    });
}

module.exports = {viewRoles, addRole};