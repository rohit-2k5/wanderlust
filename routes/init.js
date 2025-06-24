const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const initdata = require("../init/data");

router.get("/init", async (req, res) => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: "64f0b1c8d4e2f3a5c8b9c1d2"
    }));
    await Listing.insertMany(initdata.data);
    res.send("DB seeded!");
});

module.exports = router;
