const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js")
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { isloggedin } = require("../middleware.js");
const { isreviewauthor } = require("../middleware.js");

const reviewcontroller = require("../controllers/reviews.js");

// joi validation function for review form
const validatereview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error.details[0].message);
    }
    else {
        next();
    }
}

// 1 route --> to add a review 
router.post("/", isloggedin,validatereview, wrapAsync(reviewcontroller.addreview));

// 2 route --> to delete a review 
router.delete("/:reviewId", isloggedin, isreviewauthor, wrapAsync(reviewcontroller.deletereview));

module.exports = router;