//The MongoDB module exports MongoClient, used to connect MongodDB database
//use an instance of MongoClient to connect to a cluster.
//access the database in that cluster& close the connection to that cluster.
const { MongoClient } = require("mongodb");
const HttpError = require("./http-error");

// basic information about mongoDB
const url =
  "mongodb+srv://lingyi:zly123456@cluster1.mkkgg71.mongodb.net/?retryWrites=true&w=majority;";
const dbName = "StreetArt";

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
