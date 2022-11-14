const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");

const getUsers = async (req, res, next) => {
    let result;
    try {
        const User = req.app.locals.db.collection("users");
        result = await User.find().toArray();
    } catch (error) {
        console.log(error);
        return next(
            new HttpError("Fetching users failed, please try again later!", 500)
        );
    }
    res.status(200).json({ users: result });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError("Invalid input", 422));
    }
    const { name, email, password } = req.body;

    try {
        const User = req.app.locals.db.collection("users");
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return next(
                new HttpError("User exists already, please login instead!"),
                422
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
            _id: uuid(),
            name,
            email,
            password: hashedPassword,
            budget: 0,
            goal: "Saving",
        };

        await User.insertOne(newUser);

        const credential = { userId: newUser._id, email: newUser.email };

        const token = jwt.sign(credential, "supersecret_dont_share", {
            expiresIn: "24h",
        });

        res.status(201).json({
            ...credential,
            token: token,
        });
    } catch (error) {
        return next(
            new HttpError("Signing up failed, please try again later!"),
            500
        );
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const User = req.app.locals.db.collection("users");
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return next(
                new HttpError("Invalid credentials, could not log you in!", 401)
            );
        }

        try {
            const isValidPassword = await bcrypt.compare(
                password,
                existingUser.password
            );

            if (!isValidPassword) {
                return next(
                    new HttpError(
                        "Invalid credentials, could not log you in.",
                        401
                    )
                );
            }

            try {
                const token = jwt.sign(
                    { userId: existingUser._id, email: existingUser.email },
                    "supersecret_dont_share",
                    { expiresIn: "24h" }
                );

                res.status(200).json({
                    userId: existingUser._id,
                    email: existingUser.email,
                    token: token,
                });
            } catch (error) {
                console.log(error);
                return next(
                    new HttpError(
                        "Could not log you in, please check your credentials and try again!",
                        500
                    )
                );
            }
        } catch (error) {
            return next(
                new HttpError(
                    "Could not log you in, please check your credentials and try again!",
                    500
                )
            );
        }
    } catch (error) {
        return next(
            new HttpError("Logging in failed, please try again later!"),
            500
        );
    }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
