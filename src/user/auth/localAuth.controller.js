const express = require('express');
const passport = require("passport");

const User = require('../user.model')
const requireLocalAuth = require('../../middleware/requireLocalAuth');
const requireAdminAuth = require('../../middleware/requireAdminAuth');

function authRoutes() {
    const router = express.Router();

    router.post('/login', requireLocalAuth, (req, res) => {
        // console.log("in local login: ")
        const token = req.user.generateJWT();

        let me = req.user.toJSON();

        // console.log(`in login: ME: ${JSON.stringify(me)} \n Token: ${token}`)
        res.json({ success: true, token, user: req.user });
    });

    router.post('/admin/login', requireAdminAuth, (req, res) => {
        // console.log("in local login: ", req.user)
        const token = req.user.generateJWT();

        const me = req.user.toAdminJSON();

        // console.log(`in login: ME: ${JSON.stringify(me)} \n Token: ${token}`)
        res.json({ success: true, token, user: me });
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
                    res.json({ success: true, message: 'Register success.', user: user.toJSON() });
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

    router.post('/admin/register', async (req, res, next) => {

        try {
            const { email, password } = req.body;

            if(!email || !password) throw new Error('Incomplete Request Details')

            const existingUser = await User.findOne({ email });

            if (existingUser) throw new Error('User with email already exists')

            try {
                const newUser = await new User({
                    source: 'local',
                    email,
                    password,
                    role: 'ADMIN'
                });

                newUser.registerUser(newUser, (err, user) => {
                    if (err) throw err;
                    // console.log('admin register: ', user.toAdminJSON())
                    res.json({ success: true, message: 'Register success.', user: user.toAdminJSON() });
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


    router.post("/logout", (req, res) => {

        console.log('Logout')
        req.logout();
        res.send({
            success: true,
            message: 'Logout successful'
        });
        // res.redirect(process.env.CLIENT_URL);
    });

    return router;
}



module.exports.authRoutes = authRoutes