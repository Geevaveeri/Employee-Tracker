const cTable = require("console.table");
const db = require("../db/connection");

// get all departments
async function viewDepartments() {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.log("VIEW ALL ROLES");
        cTable(rows);

    });
};

// add a department
async function addDepartment(){
    const sql = `INSERT INTO departments (department_name) VALUES (?)`;
    const params = [body.department_name];

    db.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log("VIEW ALL ROLES");
        cTable(rows);

    });
};

module.exports = {viewDepartments, addDepartment};