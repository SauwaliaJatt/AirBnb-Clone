const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

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


const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if(result.error){
        let errMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
};


//listing route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
}));


//New and Create route
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

app.post("/listings", validateListing, wrapAsync (async (req, res, next) => {
    // const {title, description, price, location, country} = req.body;
    //it get simper due to listing[title]..... in form as it directly become object like and we can directly access it without above method and easy to use
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


//Edit and Update route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing});
}));

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//Delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", {listing});
}));


//error - middlewares
//page not found
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let{statusCode = 500, message = "Something Went Wrong!"} = err;
    res.render("error.ejs", {message})
    // res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});