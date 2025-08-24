const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require("console");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


// const MONGO_URL = "mongodb://127.0.0.1:27017/CourseMajorDB";
const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    secret: process.env.SECRET,
    mongoUrl: dbUrl,
    ttl: 14 * 24 * 60 * 60, // session lifetime in seconds
    autoRemove: 'native', // cleanup expired sessions
});

store.on("error", (error) => {
    console.log("Error in Mongo Session Store", error);
});

app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.ATLASDB_URL,
        ttl: 14 * 24 * 60 * 60 // 14 days
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true, ← only enable in production
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));
app.use(flash());


//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});



main()
    .then(() => {
        console. log ("connected to DB");
    })
    .catch((err) => {
        console. log(err);
    });
        
async function main() {
    await mongoose.connect(dbUrl);
}



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


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