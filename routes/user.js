const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirecturl } = require("../middleware.js");
const usercontroller = require("../controllers/users.js");

// route 1, 2 --> same path   
router.route("/signup")
.get(usercontroller.signupform) // 1 sign up form 
.post(wrapAsync(usercontroller.signup)) // 2 sing up

// route 3, 4 --> same path
router.route("/login")
.get(usercontroller.loginform) // 3 login form
.post(saveredirecturl ,passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), usercontroller.login); // 4 login 

// route 5 --> to log out a user using passport 
router.get("/logout", usercontroller.logout);

module.exports = router;