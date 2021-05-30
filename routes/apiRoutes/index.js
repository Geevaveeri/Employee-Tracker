const express = require("express");
const router = express.Router();

// activate api routes
router.use(require("./departmentRoutes"));
router.use(require("./roleRoutes"));
router.use(require("./employeeRoutes"));

module.exports = router;

