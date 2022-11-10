const express = require('express');
const passport = require("passport");


function authRoutes() {
    const router = express.Router();

    router.get(
        "/google",
        passport.authenticate("google", {
            scope: ["profile", "email"],
        })
    );

    router.get(
        "/google/callback",
        passport.authenticate("google", {
            failureRedirect: "/login/failed",
            successRedirect: process.env.CLIENT_URL
        })

    );

    router.get("/login/failed", (req, res) => {
        res.status(401).json({
            success: false,
            message: "failure",
        });
    });


    router.get("/login/success", (req, res) => {
        // console.log("In success login: ", req.sessionStore);
        if (req.user) {

            // console.log("In success login: yes: ", req.user);
            let user = req.user
            user.avgPoints = 0
            if(user.gamesPlayed>0)
                user.avgPoints = user.totalScore / user.gamesPlayed
            res.status(200).json({
                success: true,
                message: "successfull",
                user: user,
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "no login"
            });
        }
    });

    router.get("/logout", (req, res) => {
        
        // req.logout(function(err) {
        //     if (err) { 
        //         console.log("logout error: ", err)
        //         return next(err); 
        //     }
        //     res.redirect(CLIENT_URL);
        //   });
        req.logout();
        res.redirect(process.env.CLIENT_URL);
    });

    return router;

}



module.exports.authRoutes = authRoutes