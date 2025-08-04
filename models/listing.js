const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2018/04/10/23/46/architecture-3309203_1280.jpg",
        set: (v) => v === "" ? "https://cdn.pixabay.com/photo/2018/04/10/23/46/architecture-3309203_1280.jpg" : v
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;