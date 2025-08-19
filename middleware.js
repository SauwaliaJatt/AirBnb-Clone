module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("error", "Please login to create a listing");
        return res.redirect("/login");
    }
    next();
};