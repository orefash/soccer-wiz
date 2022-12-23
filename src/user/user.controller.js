const express = require('express');

const requireJwtAuth = require('../middleware/requireUserJwtAuth');

function userRoutes(UserService) {
    const router = express.Router();

    router.get('/me', requireJwtAuth, async (req, res) => {
        console.log("in me")
        let user = req.user.toJSON();
        res.json({
            success: true,
            user: user
        });
    });

    // router.patch("/:id/username",requireJwtAuth, async (req, res) => {
    router.patch("/:id/username", async (req, res) => {
        try {
            let { username } = req.body;
            let userId = req.params.id;

            if (!username) throw new Error('Invalid username')

            if (!userId) throw new Error('Invalid User ID')

            let userData = {
                username
            }

            let updatedUser = await UserService.updateUsername(userId, userData);

            // console.log('in updated: ', updatedUser)

            let rdata = {}
            rdata.success = true
            rdata.message = 'Username updated successfully'

            res.statusCode = 200
            res.json(rdata)

        } catch (error) {
            // console.log("Error in Users: ", error)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    router.patch("/:id/withdraw-settings", requireJwtAuth, async (req, res) => {
        try {
            let { phone, network, account_number, bank } = req.body;
            let userId = req.params.id;

            if (!phone || !network || !account_number || !bank) throw new Error('Invalid parameters')

            if (!userId) throw new Error('Invalid User ID')

            let userData = {
                phone, network, account_number, bank
            }

            let updatedUser = await UserService.updateWithdrawalSettings(userId, userData);

            // console.log('in updated: ', updatedUser)

            let rdata = {}
            rdata.success = true
            rdata.message = 'Settings updated successfully'
            rdata.user = updatedUser

            res.statusCode = 200
            res.json(rdata)

        } catch (error) {
            // console.log("Error in Users: ", error)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    // router.patch("/:id/profile", requireJwtAuth, async (req, res) => {
    router.patch("/:id/profile", async (req, res) => {
        try {
            let { email, fullName } = req.body;
            let userId = req.params.id;

            if (!email || !fullName) throw new Error('Invalid parameters')

            if (!userId) throw new Error('Invalid User ID')

            let userData = {
                email, fullName
            }

            let updatedUser = await UserService.updateProfileDetails(userId, userData);

            // console.log('in updated: ', updatedUser)

            let rdata = {}
            rdata.success = true
            rdata.message = 'Profile updated successfully'
            rdata.user = userData
            rdata.userId = userId

            res.statusCode = 200
            res.json(rdata)

        } catch (error) {
            // console.log("Error in Users: ", error)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });

    router.patch("/:id/toggleStatus", async (req, res) => {
        try {
            const userId = req.params.id;

            if (!userId) throw new Error("User ID is invalid")

            const updatedUser = await UserService.toggleUserStatus(userId);

            res.status(200).json({
                success: true,
                user: updatedUser
            });

        } catch (error) {
            // console.log("Error in Users: ", error)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });



    router.post("/check-username", async (req, res) => {
        try {
            const { username } = req.body;


            const user = await UserService.getUserByUsername(username);

            if (user) {
                res.status(200).json({
                    success: true,
                    found: true
                });
            } else {
                res.status(200).json({
                    success: true,
                    found: false
                });
            }


        } catch (error) {
            console.log("Error in Username check: ", error)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });

    router.get("/", async (req, res) => {
        try {

            let data = {}
            let a = null;

            a = await UserService.getUsers();
            data.users = a;
            data.success = true;
            res.status(200).json(data);

        } catch (error) {
            console.log("error: ", error.message)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    router.get("/:id", async (req, res) => {
        try {
            const user = await UserService.getUserById(req.params.id);

            if (user) {
                res.status(200).json({
                    success: true,
                    user: user
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "User not found"
                });
            }


        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    return router;

}

module.exports.userRoutes = userRoutes