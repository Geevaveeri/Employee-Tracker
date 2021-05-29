const express = require("express");
const router = express.Router();

// activate api routes
router.use(require("./departmentRoutes"));
router.use(require("./roleRoutes"));

module.exports = router;

