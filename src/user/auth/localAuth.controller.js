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
        res.json({ token, user: req.user });
    });

    router.post('/register', async (req, res, next) => {

        try {
            const { email, password, phone } = req.body;

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(422).send({ message: 'Email is in use' });
            }

            try {
                const newUser = await new User({
                    source: 'local',
                    email,
                    password,
                    phone
                });

                newUser.registerUser(newUser, (err, user) => {
                    if (err) throw err;
                    res.json({ success: true, message: 'Register success.' }); // just redirect to login
                });
            } catch (err) {
                // return next(err);
                // console.log("reg erro: ", err)
                res.json({ success: false, message: 'Register Failure.' });
            }
        } catch (err) {
            // return next(err);
                // console.log("reg erro: ", err)
            res.json({ success: false, message: 'Register Failure.' });
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