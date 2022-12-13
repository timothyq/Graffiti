const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const fs = require("fs");
const uploadImg = require("../util/uploadImg");

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let existingPlace;
    try {
        const Place = req.app.locals.db.collection("places");
        existingPlace = await Place.findOne({ _id: placeId });
    } catch (error) {
        return next(
            new HttpError("Something went wrong, could not find place!", 500)
        );
    }

    if (!existingPlace) {
        return next(
            new HttpError("Conld not find a place for the provided id.", 404)
        );
    }
    res.status(200).json({ place: existingPlace });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const Place = req.app.locals.db.collection("places");
        const existingPlaces = await Place.find({
            creator: userId,
        }).toArray();
        if (!existingPlaces) {
            return next(
                new HttpError(
                    "Conld not find places for the provided user id.",
                    500
                )
            );
        }
        res.status(200).json({
            places: existingPlaces,
        });
    } catch (error) {
        return next(
            new HttpError("Fetching places failed, please try again later", 500)
        );
    }
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs, double check them!", 422));
    }
    const { title, description, address } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const url = await uploadImg(req.file.path);
    const createdPlace = {
        _id: uuid(),
        title,
        description,
        address,
        location: coordinates,
        image: url,
        creator: req.userData.userId,
    };

    try {
        const User = req.app.locals.db.collection("users");
        const Place = req.app.locals.db.collection("places");
        const existingUser = await User.findOne({ _id: req.userData.userId });

        if (!existingUser) {
            return next(
                new HttpError("Could not find user for provided id", 500)
            );
        }
        let places = existingUser.places;
        places.push(createdPlace._id);
        const updatedUser = {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image,
            password: existingUser.password,
            places,
        };

        await Place.insertOne(createdPlace);
        await User.replaceOne({ _id: req.userData.userId }, updatedUser);
        res.status(201).json({ place: createdPlace });
    } catch (error) {
        console.log(error.message);
        return next(
            new HttpError("Creating place failed, please try again", 500)
        );
    }
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Invalid inputs, double check them!", 422));
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;

    try {
        const Place = req.app.locals.db.collection("places");
        const existingPlace = await Place.findOne({ _id: placeId });
        if (!existingPlace) {
            return next(
                new HttpError("Conld not find place for the provided id.", 404)
            );
        }

        if (existingPlace.creator.toString() !== req.userData.userId) {
            return next(new HttpError("Unauthorized.", 403));
        }

        const updatedPlace = {
            _id: placeId,
            title,
            description,
            address: existingPlace.address,
            location: existingPlace.location,
            image: existingPlace.image,
            creator: existingPlace.creator,
        };

        await Place.replaceOne({ _id: placeId }, updatedPlace);
        res.status(200).json({
            place: updatedPlace,
        });
    } catch (error) {
        console.log(error.message);
        return next(
            new HttpError("Something went wrong, could not update place!", 500)
        );
    }
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    try {
        const Place = req.app.locals.db.collection("places");
        const User = req.app.locals.db.collection("users");
        const existingPlace = await Place.findOne({ _id: placeId });
        const existingUser = await User.findOne({ _id: req.userData.userId });

        if (!existingPlace) {
            return next(new HttpError("Could not find place for this id"), 204);
        }

        if (existingPlace.creator !== req.userData.userId) {
            return next(new HttpError("Unauthorized.", 403));
        }

        await Place.deleteOne({ _id: placeId });

        let places = existingUser.places;
        const index = places.indexOf(placeId);
        if (index > -1) {
            places.splice(index, 1);
        }

        const updatedUser = {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image,
            password: existingUser.password,
            places,
        };

        await User.replaceOne({ _id: req.userData.userId }, updatedUser);

        fs.unlink(existingPlace.image, (err) => {
            console.log(err);
        });

        res.status(200).json({ message: "Success!" });
    } catch (error) {
        return next(
            new HttpError("Somethin went wrong, could not delete place!", 500)
        );
    }
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
