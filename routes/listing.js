const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js")
const Listing = require("../models/listing.js");
const passport = require("passport");
const { isloggedin , isowner} = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js")
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

// joi validation middleware function for add and edit listing 
const validatelisting = (req, res, next) => {
    // Validate only the fields present in req.body, since image is handled by multer
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
}

// search route 
router.get("/search", wrapAsync(listingcontroller.searchlisting));

// 2 route --> form of adding new listing 
router.get("/new", isloggedin, listingcontroller.addnewlistingform);

// 1, 4 route --> same path 
router.route("/")
.get(wrapAsync(listingcontroller.index)) // 1 show all listing
.post(isloggedin, upload.single('listing[image]'), validatelisting, wrapAsync(listingcontroller.createlisting)) // 4 add new listing 

// 3, 6, 7 --> same path
router.route("/:id")
.get(wrapAsync(listingcontroller.showspecificlisting)) // 3 show
.put(isloggedin, isowner,upload.single('listing[image]'), validatelisting,wrapAsync(listingcontroller.updatelisting)) // 6 update
.delete(isloggedin, isowner, wrapAsync(listingcontroller.deletelisting)) // 7 delete

// 5 route --> sending the form of edit when edit button clicked of editing a listing 
router.get("/:id/edit", isloggedin, isowner, wrapAsync(listingcontroller.updatelistingform));

module.exports = router;