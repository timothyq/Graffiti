const { PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = require("./s3Client"); // Helper function that creates an Amazon S3 service client module.
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const uploadImg = async (file) => {
    // Path to and name of object. For example '../myFiles/index.js'.
    const fileStream = fs.createReadStream(file);
    const s3bucketKey = encodeURIComponent(path.basename(file));

    // Set the parameters
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: s3bucketKey,
        Body: fileStream,
        ACL: "public-read",
    };

    // Upload file to specified bucket.
    try {
        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("Success");
        return `https://streetart2022.s3.us-west-1.amazonaws.com/${s3bucketKey}`;
    } catch (err) {
        console.log("Error", err);
    }
};

// uploadImg(
//     "/Users/huihu/Documents/Street Art/backend/uploads/images/bb2a28b2-4f9a-4e81-978f-18a9ca222260.jpeg"
// ).then((data) => console.log(data));

module.exports = uploadImg;
