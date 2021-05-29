const express = require("express");
const router = express.Router();

// activate api routes
router.use(require("./departmentRoutes"));

module.exports = router;

