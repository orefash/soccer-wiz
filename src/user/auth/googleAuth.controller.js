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

    const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;

    router.get(
        "/google/callback",
        passport.authenticate("google", {
            failureRedirect: "/",
            // failureRedirect: "/login/failed",
            // successRedirect: process.env.CLIENT_URL
            session: false,
        }),
        (req, res) => {
          const token = req.user.generateJWT();
          res.cookie('x-auth-cookie', token);
          console.log("Callback: ", clientUrl)
          res.redirect(clientUrl);
        },

    );

    // router.get("/login/failed", (req, res) => {
    //     res.status(401).json({
    //         success: false,
    //         message: "failure",
    //     });
    // });


    // router.get("/login/success", (req, res) => {
    //     // console.log("In success login: ", req.sessionStore);
    //     if (req.user) {

    //         // console.log("In success login: yes: ", req.user);
    //         let user = req.user
    //         user.avgPoints = 0
    //         if(user.gamesPlayed>0)
    //             user.avgPoints = user.totalScore / user.gamesPlayed
    //         res.status(200).json({
    //             success: true,
    //             message: "successfull",
    //             user: user,
    //         });
    //     }
    //     else {
    //         res.status(404).json({
    //             success: false,
    //             message: "no login"
    //         });
    //     }
    // });

    

    return router;

}



module.exports.authRoutes = authRoutes