const express = require("express");
const { check } = require("express-validator");
const expensesControllers = require("../controllers/expenses-controllers");
const checkAuth = require("../middleware/check_auth");
const router = express.Router();

router.use(checkAuth);

router.get("/id/:eid", expensesControllers.getExpenseById);

router.get("/user/:uid", expensesControllers.getExpensesByUserId);

router.post(
    "/",
    [
        check("amount").isNumeric(),
        check("description").isLength({ min: 5 }),
        check("category").not().isEmpty(),
        check("date").not().isEmpty(),
    ],
    expensesControllers.createExpense
);

router.patch(
    "/:eid",
    [
        check("amount").isNumeric(),
        check("description").isLength({ min: 5 }),
        check("category").not().isEmpty(),
        check("date").not().isEmpty(),
    ],
    expensesControllers.updateExpense
);

router.delete("/:eid", expensesControllers.deleteExpense);

module.exports = router;
