// core backend logic for listings--> listing routes whole logic
const Listing = require("../models/listing");

module.exports.index = async(req, res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.addnewlistingform = (req, res)=>{
    res.render("listings/new.ejs");
}

module.exports.showspecificlisting = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});              
}

module.exports.createlisting = async (req, res) => {
    try {
        const { listing } = req.body;
        const newlisting = new Listing(listing);

        // Set owner and image
        newlisting.owner = req.user._id;
        if (req.file) {
            newlisting.image = { url: req.file.path, filename: req.file.filename };
        }

        // Get location
        // const locationText = `${newlisting.location}, ${newlisting.country}`;
        // const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`);
        // const data = await response.json();

        // if (data && data.length > 0) {
        //     newlisting.latitude = parseFloat(data[0].lat);
        //     newlisting.longitude = parseFloat(data[0].lon);
        // } else {
        //     console.log("⚠️ Geocoding failed. Coordinates not found.");
        // }

        await newlisting.save();
        req.flash("success", "New listing added successfully!");
        res.redirect("/listings");

    } catch (err) {
        console.error("❌ Error creating listing:", err);
        req.flash("error", "Error creating listing.");
        res.redirect("/listings");
    }
};

module.exports.updatelistingform = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace("/upload", "/upload/h_180,w_250");
    res.render("listings/edit.ejs", {listing, originalimageurl});
}

module.exports.updatelisting = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
            new: true,
            runValidators: true,
        });

        // If new image uploaded
        if (req.file) {
            listing.image = { url: req.file.path, filename: req.file.filename };
        }

        // Recalculate coordinates if location or country changed
        /*
        const locationText = `${listing.location}, ${listing.country}`;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`);
        const data = await response.json();

        if (data && data.length > 0) {
            listing.latitude = parseFloat(data[0].lat);
            listing.longitude = parseFloat(data[0].lon);
        } else {
            console.log("⚠️ Geocoding failed. Coordinates not updated.");
        }
        */

        await listing.save();
        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${listing._id}`);

    } catch (err) {
        console.error("❌ Error updating listing:", err);
        req.flash("error", "Error updating listing.");
        res.redirect("/listings");
    }
};


module.exports.deletelisting = async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted successfully");
    res.redirect("/listings");
}


module.exports.searchlisting = async (req, res) => {
    const query = req.query.q;
    const listings = await Listing.find({
        $or: [
            { location: { $regex: query, $options: 'i' } },
            { country: { $regex: query, $options: 'i' } }, 
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    });
    res.render("listings/index.ejs", { allListings: listings });
};
