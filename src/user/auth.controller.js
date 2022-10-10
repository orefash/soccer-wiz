const express = require('express');
const passport = require("passport");


require("../passportConfig/google");

function authRoutes(UserService) {
    const router = express.Router();

    router.get(
        "/auth/google",
        passport.authenticate("google", {
            scope: ["profile", "email"],
        })
    );
    
    router.get(
        "/auth/google/callback",
        passport.authenticate("google", {
            failureRedirect: "/",
            successRedirect: "/profile",
            failureFlash: true,
            successFlash: "Successfully logged in!",
        })
        
    );
    
    router.get("/auth/logout", (req, res) => {
        req.flash("success", "Successfully logged out");
        req.session.destroy(function () {
            res.clearCookie("connect.sid");
            res.redirect("/");
        });
    });
    
    router.post("/auth/local/signup", async (req, res) => {
        const { first_name, last_name, email, password } = req.body
    
        if (password.length < 8) {
            req.flash("error", "Account not created. Password must be 7+ characters long");
            return res.redirect("/local/signup");
        }
    
        try {
            await UserService.addLocalUser({
                email,
                firstName: first_name,
                lastName: last_name,
                password
            })
        } catch (e) {
            req.flash("error", "Error creating a new account. Try a different login method.");
            res.redirect("/local/signup")
        }
    
        res.redirect("/local/signin")
    });
    
    router.post("/auth/local/signin",
        passport.authenticate("local", {
            successRedirect: "/profile",
            failureRedirect: "/local/signin",
            failureFlash: true
        })
    );

    return router;

}



module.exports.authRoutes = authRoutes