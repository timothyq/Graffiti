const express = require("express");
const bodyParser = require("body-parser");

const connectDB = require("./models/connect");
const usersRoutes = require("./routes/users-routes");
const expensesRoutes = require("./routes/expenses-routes");
const dashboardRoutes = require("./routes/dashboard-routes")
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5501");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PATCH, DELETE"
    );
    next();
});

app.use("/users", usersRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/expenses", expensesRoutes);

app.use((req, res, next) => {
    throw new HttpError("Could not find the route", 404);
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500).json({
        message: error.message || "An unknown error!",
    });
});

connectDB()
    .then((db) => {
        app.locals.db = db;
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
