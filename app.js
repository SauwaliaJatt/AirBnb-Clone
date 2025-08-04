const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/CourseMajorDB";

main()
    .then(() => {
        console. log ("connected to DB");
    })
    .catch((err) => {
        console. log(err);
    });
        
async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", async (req, res) => {
    try {
        const listings = await Listing.find({});
        res.json(listings);
    } catch (err) {
        res.status(500).send("Error fetching listings");
    }
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});