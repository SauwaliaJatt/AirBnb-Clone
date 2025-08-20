const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");




//listing route
router.get("/", wrapAsync(listingController.index));


//New and Create route
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));


//show route
router.get("/:id", wrapAsync(listingController.showListing));


//Edit and Update route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));


//Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


module.exports = router;