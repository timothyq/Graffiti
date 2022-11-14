const { MongoClient } = require("mongodb");
const HttpError = require("./http-error");

// basic information about mongoDB
const url =
    "mongodb+srv://root:DB123456@mern.vzfjptn.mongodb.net/wallet?retryWrites=true&w=majority";
const dbName = "wallet";

// connect to MongoDB accoring to provided database name
async function connectDB() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const database = client.db(dbName);
        console.log("Connected successfully to server");
        return database;
    } catch (error) {
        throw "Something wrong when connecting Database";
    }
}


module.exports = connectDB;
