const Listing = require("./models/listing");
const Review = require("./models/reviews");

module.exports.isloggedin = (req, res, next)=>{
    if(!req.isAuthenticated()){
        // if user is not logged in then redirecturl ko save karna hai
        req.session.redirecturl = req.originalUrl;
        req.flash("error", "You must be logged in !");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirecturl = (req, res, next) =>{
    if(req.session.redirecturl){
        res.locals.redirecturl = req.session.redirecturl;
    }
    next();
}

module.exports.isowner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing || !listing.owner || !listing.owner.equals(res.locals.curruser._id)){
        req.flash("error", "You are not the Owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isreviewauthor = async(req, res, next) => {
    let {reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
}


    