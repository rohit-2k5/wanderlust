// this file is basically for inserting the data that we have initially 
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";


main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner: "64f0b1c8d4e2f3a5c8b9c1d2"})); // Replace with actual user ID
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
}

initDB();
