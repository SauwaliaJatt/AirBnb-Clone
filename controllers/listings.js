const Listing = require("../models/listing.js");



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
};


module.exports.createListing = async (req, res, next) => {
    // const {title, description, price, location, country} = req.body;
    //it get simper due to listing[title]..... in form as it directly become object like and we can directly access it without above method and easy to use
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: ({path: "author"})}).populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", {listing});
};


module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", {listing});
};


module.exports.updateListing = async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

