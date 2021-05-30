const cTable = require("console.table");
const db = require("../db/connection");

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
        console.log("VIEW ALL EMPLOYEES");
        cTable(rows);
    });

};
module.exports = viewEmployee;