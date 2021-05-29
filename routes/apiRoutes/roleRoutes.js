const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

// view all roles route
router.get("/roles", (req, res) => {
    const sql = `SELECT roles.*, departments.department_name AS department
                    FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;
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

// add a role
router.post("/roles", ({ body }, res) => {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
    const params = [body.title, body.salary, body.department_id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: body
        });
    });
});

module.exports = router;