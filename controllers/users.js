// core backend code for user routes 
const User = require("../models/user.js");

module.exports.signupform = (req, res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req, res)=>{
    try{
        let {username, email, password} = req.body;
        let newuser = new User({email, username});
        let registereduser = await User.register(newuser, password);
        req.login(registereduser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "You are signed up");
            res.redirect(res.locals.redirecturl || "/listings");
        })
    }
    catch(e){
        req.flash("error", "user already exists!");
        res.redirect("/signup");
    }

}

module.exports.loginform = (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req, res)=>{
    req.flash("success", "You are logged In");
    res.redirect(res.locals.redirecturl || "/listings");
}

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged Out successfully");
        res.redirect("/listings");
    })
}