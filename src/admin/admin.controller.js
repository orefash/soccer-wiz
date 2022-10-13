const express = require('express');
const passport = require("passport");


function authRoutes(AdminService) {
    const router = express.Router();

   

    router.get("/login/failed", (req, res) => {
        res.status(401).json({
            success: false,
            message: "failure",
        });
    });


    router.get("/login/success", (req, res) => {
        if (req.user) {

            // console.log("In success login: yes: ", req.user);
            res.status(200).json({
                success: true,
                message: "successful",
                user: req.user,
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
        
       
        req.logout();
        res.redirect(process.env.CLIENT_URL);
    });

    return router;

}



module.exports.authRoutes = authRoutes