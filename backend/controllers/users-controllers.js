const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const uploadImg = require("../util/uploadImg");

const getUsers = async (req, res, next) => {
    let result;
    try {
        const User = req.app.locals.db.collection("users");
        result = await User.find().toArray();
    } catch (error) {
        return next(
            new HttpError("Fetching users failed, please try again later!", 500)
        );
    }
    res.status(200).json({ users: result });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
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

        const url = await uploadImg(req.file.path);

        const newUser = {
            _id: uuid(),
            name,
            email,
            image: url,
            password: hashedPassword,
            places: [],
        };

        await User.insertOne(newUser);

        const credential = { userId: newUser._id, email: newUser.email };

        const token = jwt.sign(credential, process.env.JWT_KEY, {
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

    // check existing user with the provided email
    let existingUser;
    try {
        const User = req.app.locals.db.collection("users");
        existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return next(
                new HttpError("Invalid credentials, could not log you in!", 401)
            );
        }
    } catch (err) {
        return next(
            new HttpError("Invalid credentials, could not log you in!", 401)
        );
    }

    // check password
    try {
        const isValidPassword = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!isValidPassword) {
            return next(
                new HttpError("Invalid credentials, could not log you in.", 401)
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

    // get token
    let token;
    try {
        token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
            process.env.JWT_KEY,
            { expiresIn: "24h" }
        );
    } catch (error) {
        return next(
            new HttpError("Logging in failed, please try again later!", 500)
        );
    }

    res.status(200).json({
        userId: existingUser._id,
        email: existingUser.email,
        token: token,
    });
};

// access image: define callback func. So the handler in router can use it.
const getPlaces = async (req, res, next) => {
    console.log("get places");
    //Backend connect to MongoDB
    let result;
    try {
        //req.body is a object
        const { email } = req.body;
        const PlaceImage = req.app.locals.db.collection("places");
        result = await PlaceImage.find({ creator: email }).toArray();
        res.status(200).json({ places: result });
    } catch (error) {
        return next(
            new HttpError(
                "Fetching places failed, please try again later!",
                500
            )
        );
    }
};

exports.getPlaces = getPlaces;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
