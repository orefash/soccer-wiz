const express = require('express');
const passport = require("passport");


function authRoutes() {
    const router = express.Router();

    router.get(
        '/facebook',
        passport.authenticate('facebook', {
            scope: ['public_profile', 'email'],
        }),
    );

    const clientUrl = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;


    router.get(
        '/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/',
            session: false,
        }),
        (req, res) => {
            // console.log("in fb: ", req.user);
            const token = req.user.generateJWT();
            res.cookie('x-auth-cookie', token);
            res.redirect(clientUrl);
        },
    );


    return router;

}



module.exports.authRoutes = authRoutes