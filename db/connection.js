const mysql = require('mysql2');
require("dotenv").config();

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: process.env.DB_PASS,
  database: 'tracker'
});

// Start DB connection
db.connect(err => {
  if (err) throw err;
});

module.exports = db;