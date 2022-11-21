const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const fs = require("fs");

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let existingPlace;
    try {
        const Place = req.app.locals.db.collection("places");
        existingPlace = await Place.findOne({ _id: placeId });
    } catch (error) {
        console.log(error.message);
        return next(
            new HttpError("Something went wrong, could not find place!", 500)
        );
    }

    if (!existingPlace) {
        return next(
            new HttpError("Conld not find a place for the provided id.", 404)
        );
    }

    if (existingPlace.creator !== req.userData.userId) {
        return next(new HttpError("Unauthorized.", 403));
    }

    res.status(200).json({ expense: existingPlace });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    if (userId !== req.userData.userId) {
        return next(new HttpError("Unauthorized.", 403));
    }

    try {
        const Place = req.app.locals.db.collection("places");
        const existingPlaces = await Expense.find({
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
        console.log(errors);
        return next(new HttpError("Invalid inputs, double check them!", 422));
    }
    const { title, description, address } = req.body;

    if (creator !== req.userData.userId) {
        return next(new HttpError("Unauthorized.", 403));

        let coordinates;
        try {
            coordinates = await getCoordsForAddress(address);
        } catch (error) {
            return next(error);
        }
    }

    const createdPlace = {
        _id: uuid(),
        title,
        description,
        address,
        location: coordinates,
        image: req.file.path,
        creator: req.userData.userId,
    };

    try {
        const User = req.app.locals.db.collection("users");
        const Place = req.app.locals.db.collection("places");
        const existingUser = await User.findOne({ _id: creator });

        if (!existingUser) {
            return next(
                new HttpError("Could not find user for provided id", 500)
            );
        }

        await Place.insertOne(createPlace);
        res.status(201).json({ place: createPlace });
    } catch (error) {
        return next(
            new HttpError("Creating place failed, please try again", 500)
        );
    }
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError("Invalid inputs, double check them!", 422));
    }
    const { title, description } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next(
            new HttpError("Something went wrong, could not update place!", 500)
        );
    }

    if (place.creator.toString() !== req.userData.userId) {
        return next(
            new HttpError("You are not allowed to edit this place!", 401)
        );
    }

    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (error) {
        return next(
            new HttpError("Something went wrong, could not update place!", 500)
        );
    }

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate("creator");
    } catch (error) {
        return next(
            new HttpError(
                "Something went wrong, could not delete place! Since could not find the creator for provided id",
                500
            )
        );
    }

    if (!place) {
        return next(new HttpError("Could not find place for this id"), 404);
    }

    if (place.creator.id !== req.userData.userId) {
        return next(
            new HttpError("You are not allowed to delete this place!", 401)
        );
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (error) {
        return next(
            new HttpError("Somethin went wrong, could not delete place!", 500)
        );
    }
    fs.unlink(place.image, (err) => {
        console.log(err);
    });
    res.status(200).json({ message: "Success!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
