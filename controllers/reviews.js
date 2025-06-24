// core backend code for reviews
const Listing = require("../models/listing.js")
const Review = require("../models/reviews.js");

module.exports.addreview = async(req, res)=>{
    let {id} = req.params;
    let listing =  await Listing.findById(id);
    let newreview = new Review(req.body.review);
    
    newreview.author = req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${id}`);
}

module.exports.deletereview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
}