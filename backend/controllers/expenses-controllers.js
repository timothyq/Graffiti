const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");

const HttpError = require("../models/http-error");

const getExpenseById = async (req, res, next) => {
    const expenseId = req.params.eid;

    let existingExpense;
    try {
        const Expense = req.app.locals.db.collection("expenses");
        existingExpense = await Expense.findOne({ _id: expenseId });
    } catch (error) {
        console.log(error);
        return next(
            new HttpError("Something went wrong, could not find expense!", 500)
        );
    }

    if (!existingExpense) {
        return next(
            new HttpError("Conld not find a expense for the provided id.", 204)
        );
    }

    if (existingExpense.creator !== req.userData.userId) {
        return next(new HttpError("Unauthorized.", 403));
    }

    res.status(200).json({ expense: existingExpense });
};

const getExpensesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    if (userId !== req.userData.userId) {
        return next(new HttpError("Unauthorized.", 403));
    }

    try {
        const Expense = req.app.locals.db.collection("expenses");
        const expenses = await Expense.find({ creator: userId }).toArray();
        if (!expenses) {
            return next(
                new HttpError(
                    "Conld not find expenses for the provided user id.",
                    500
                )
            );
        }
        res.status(200).json({
            expenses: expenses,
        });
    } catch (error) {
        return next(
            new HttpError(
                "Fetching expenses failed, please try again later",
                500
            )
        );
    }
};

const createExpense = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError("Invalid inputs, double check them!", 422));
    }
    const { amount, description, date, category, creator } = req.body;

    if (creator !== req.userData.userId) {
        return next(new HttpError("Unauthorized.", 403));
    }

    const newExpense = {
        _id: uuid(),
        amount,
        description,
        date: new Date(date),
        category,
        creator,
    };

    try {
        const User = req.app.locals.db.collection("users");
        const Expense = req.app.locals.db.collection("expenses");
        const user = await User.findOne({ _id: creator });

        if (!user) {
            return next(
                new HttpError("Could not find user for provided id", 500)
            );
        }

        await Expense.insertOne(newExpense);

        res.status(201).json({ expense: newExpense });
    } catch (error) {
        return next(
            new HttpError("Creating expense failed, please try again", 500)
        );
    }
};

const updateExpense = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError("Invalid inputs, double check them!", 422));
    }
    const { amount, description, date, category } = req.body;
    const expenseId = req.params.eid;

    try {
        const Expense = req.app.locals.db.collection("expenses");
        const existingExpense = await Expense.findOne({ _id: expenseId });
        if (!existingExpense) {
            return next(
                new HttpError(
                    "Conld not find expense for the provided id.",
                    404
                )
            );
        }

        if (existingExpense.creator !== req.userData.userId) {
            return next(new HttpError("Unauthorized.", 403));
        }

        const updatedExpense = {
            _id: expenseId,
            creator: existingExpense.creator,
            amount,
            description,
            date: new Date(date),
            category,
        };

        await Expense.replaceOne({ _id: expenseId }, updatedExpense);
        res.status(200).json({
            expense: updatedExpense,
        });
    } catch (error) {
        return next(
            new HttpError(
                "Something went wrong, could not update expense!",
                500
            )
        );
    }
};

const deleteExpense = async (req, res, next) => {
    const expenseId = req.params.eid;

    try {
        const Expense = req.app.locals.db.collection("expenses");
        const existingExpense = await Expense.findOne({ _id: expenseId });

        if (!existingExpense) {
            return next(
                new HttpError("Could not find expense for this id"),
                204
            );
        }

        if (existingExpense.creator !== req.userData.userId) {
            return next(new HttpError("Unauthorized.", 403));
        }

        await Expense.deleteOne({ _id: expenseId });
        res.status(200).json({ message: "Success!" });
    } catch (error) {
        return next(
            new HttpError("Somethin went wrong, could not delete expense!", 500)
        );
    }
};

const getLoggedInUserExpenses = async (req, res, next) => {
    try {
        const User = req.app.locals.db.collection("users");
        const result = await User.findOne({ _id: req.userData.userId });

        if (!result) {
            return next(new HttpError("User not logged in!"), 403);
        }

        result.password = undefined;
        res.status(200).json({ user: result });
    } catch (error) {
        console.log(error);
        return next(
            new HttpError("Fetching users failed, please try again later!", 500)
        );
    }
};

exports.getExpenseById = getExpenseById;
exports.getExpensesByUserId = getExpensesByUserId;
exports.createExpense = createExpense;
exports.updateExpense = updateExpense;
exports.deleteExpense = deleteExpense;
exports.getLoggedInUserExpenses = getLoggedInUserExpenses;
