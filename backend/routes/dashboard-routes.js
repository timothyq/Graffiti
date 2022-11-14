const express = require("express");
const dashboardController = require("../controllers/dashboard-controller");
const checkAuth = require("../middleware/check_auth");

const router = express.Router();

// router.use(checkAuth);
router.post("/", dashboardController.getDashBoard);

module.exports = router;
