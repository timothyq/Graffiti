const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./models/connect");
const usersRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");
const HttpError = require("./models/http-error");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(bodyParser.json());

//Code Review: Some Pics lost in the demo. Images may be stored in the database, expecially when there're related to a specific user or contents.
app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type,Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
    throw new HttpError("Could not find the route", 404);
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
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
        app.listen(process.env.PORT || 3000);
    })
    .catch((err) => {
        console.log(err.message);
    });
