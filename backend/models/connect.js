//The MongoDB module exports MongoClient, used to connect MongodDB database
//use an instance of MongoClient to connect to a cluster.
//access the database in that cluster& close the connection to that cluster.
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

// basic information about mongoDB
dotenv.config()
const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;

// connect to MongoDB accoring to provided database name
async function connectDB() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        const database = client.db(dbName);
        console.log("Connected successfully to server");
        return database;
    } catch (error) {
        console.log(error.message);
        throw "Something wrong when connecting Database";
    }
}

module.exports = connectDB;
