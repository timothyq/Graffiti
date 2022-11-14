const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    budget: {
        month: {type: Number, require: false},
        year: {type: Number, required: false},
    },
    expenses: [{ type: mongoose.Types.ObjectId, required: true, ref: "Expense" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
