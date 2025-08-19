const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");


//validate Listingsusing joi
const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if(result.error){
        let errMsg = result.error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};


//listing route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
}));


//New and Create route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new");
});


router.post("/", isLoggedIn, validateListing, wrapAsync (async (req, res, next) => {
    // const {title, description, price, location, country} = req.body;
    //it get simper due to listing[title]..... in form as it directly become object like and we can directly access it without above method and easy to use
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));


//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", {listing});
}));


//Edit and Update route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", {listing});
}));

router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));


//Delete route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));


module.exports = router;