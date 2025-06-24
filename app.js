if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");

// requiring all the routes for all the models
const listingrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userrouter = require("./routes/user.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const dburl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect(dburl);
}

// mongo store setup for session management
const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", function(e){
    console.log("error in mongo store", e);
});

// session setup 
const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:  {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

// to use the session and flash 
app.use(session(sessionOptions));
app.use(flash());


// for passport/passport local mongoose setup 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middle ware to use the connect flash--> to show any messages
// this is important because ejs me locals se hi kisi req.user ko access kr skte hai direct nahi 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
})



// listing, reviews, user  ke sarre route use krne ke liye
app.use("/listings", listingrouter);
app.use("/listings/:id/reviews", reviewrouter);
app.use("/", userrouter);


// agar aise koi route ke pass req send karta hia jo exit nahi karta then it should return page not found error 
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "page not found"));
})

// error handle --> middle ware
app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", {message});
})

app.listen(8080, ()=>{
    console.log("server started at port: 8080");
})