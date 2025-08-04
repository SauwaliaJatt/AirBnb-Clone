const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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


//listing route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
});


//New and Create route
app.get("/listings/new", async (req, res) => {
    res.render("listings/new");
});

app.post("/listings", async (req, res) => {
    // const {title, description, price, location, country} = req.body;
    //it get simper due to listing[title]..... in form as it directly become object like and we can directly access it without above method and easy to use
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});


//Edit and Update route
app.get("/listings/:id/edit", async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing});
});

app.put("/listings/:id", async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
});


//show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", {listing});
});



app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});