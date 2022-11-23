const express = require('express');
const passport = require("passport");

const User = require('../user.model')
const requireLocalAuth = require('../../middleware/requireLocalAuth');

function authRoutes() {
    const router = express.Router();

    router.post('/login', requireLocalAuth, (req, res) => {
        // console.log("in local login: ", req.user)
        const token = req.user.generateJWT();

        const me = req.user.toJSON();

        // console.log(`in login: ME: ${JSON.stringify(me)} \n Token: ${token}`)
        res.json({ success: true, token, user: req.user });
    });

    router.post('/register', async (req, res, next) => {

        try {
            const { email, password, phone, country } = req.body;

            if(!email || !phone || !password) throw new Error('Incomplete Request Details')

            const existingUser = await User.findOne({ email });

            if (existingUser) throw new Error('User with email already exists')

            try {
                const newUser = await new User({
                    source: 'local',
                    email,
                    password,
                    phone,
                    country
                });

                newUser.registerUser(newUser, (err, user) => {
                    if (err) throw err;
                    res.json({ success: true, message: 'Register success.', user: user }); // just redirect to login
                });
            } catch (err) {
                // return next(err);
                // console.log("reg erro: ", err)
                res.json({ success: false, message: 'Register Failure: '+err.message });
            }
        } catch (err) {
            // return next(err);
                // console.log("reg erro: ", err)
            res.json({ success: false, message: 'Register Failure: '+err.message });
        }
    });


    router.get("/logout", (req, res) => {

        req.logout();
        // res.send(false);
        res.redirect(process.env.CLIENT_URL);
    });

    return router;
}



module.exports.authRoutes = authRoutes