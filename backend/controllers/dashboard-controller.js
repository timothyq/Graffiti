const HttpError = require("../models/http-error");

const getDashBoard = async (req, res, next) => {
    try {
        const User = await req.app.locals.db.collection("users");
        const userData = await User.findOne({
            _id: "1be8763c-b43b-4b07-8185-8d32a2de3bfd",
        }); //

        if (!userData) {
            return next(new HttpError("Could not find user for this id"), 204);
        }
        const budget = userData.budget;
        const goal = userData.goal;

        const Expense = await req.app.locals.db.collection("expenses");
        const eData = await Expense.find({
            creator: userData._id,
        }).toArray();

        if (!eData || eData.length === 0) {
            return next(
                new HttpError("Could not find expense for this id"),
                204
            );
        }

        var n = eData.length;
        var remains = budget;
        const year = new Date().getFullYear();
        const month = new Date().getMonth();

        var series = [0, 0, 0, 0, 0, 0];
        // ["Appearance", "Food", "Learning", "Other", "Rent", "Transportation"]

        var date;
        for (var i = 0; i < n; i++) {
            date = new Date(eData[i].date);
            if (date.getFullYear() === year && date.getMonth() === month) {
                remains -= eData[i].amount;
            }
            switch (eData[i].category) {
                case "Appearance":
                    series[0] += eData[i].amount;
                    break;
                case "Food":
                    series[1] += eData[i].amount;
                    break;
                case "Learning":
                    series[2] += eData[i].amount;
                    break;
                case "Other":
                    series[3] += eData[i].amount;
                    break;
                case "Rent":
                    series[4] += eData[i].amount;
                    break;
                case "Transportation":
                    series[5] += eData[i].amount;
                    break;
            }
        }

        const dashboardInfo = {
            budget,
            goal,
            remains,
            series,
        };

        res.status(200).json(dashboardInfo);
    } catch (error) {
        console.log(error);
        return next(
            new HttpError("Something went wrong, could not find info!", 500)
        );
    }
};

exports.getDashBoard = getDashBoard;
