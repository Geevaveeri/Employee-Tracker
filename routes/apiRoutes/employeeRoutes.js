const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

// get all employees
router.get("/employees", (req, res) => {
    // role.title, roles.department_id = departments.id, role.salary, employees.manager_id = manager.id
    const sql = `SELECT employees.id, 
                    employees.first_name, 
                    employees.last_name, 
                    roles.title AS title,
                    departments.department_name AS department,
                    roles.salary,
                    CONCAT(manager.first_name, '', manager.last_name) AS manager
                 FROM employees
                 LEFT JOIN employees manager on manager.id = employees.manager_id
                 LEFT JOIN roles ON employees.role_id = roles.id
                 LEFT JOIN departments ON departments.id = roles.department_id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

module.exports = router;