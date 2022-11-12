const express = require('express');
const router = express.Router();

const requireJwtAuth = require('../middleware/requireJwtAuth');

function userRoutes(UserService) {
    const router = express.Router();

    router.get('/me', requireJwtAuth, (req, res) => {
        let user = req.user.toJSON();
        res.json({
            success: true,
            user: user
        });
    });

    router.patch("/details/:id", async (req, res) => {
        try {
            const { username, country } = req.body;

            const userData = {
                username, country
            }

            const updatedUser = await UserService.updateUsernameAndCountry(req.params.id, userData);

            res.status(200).json({
                success: true,
                user: updatedUser
            });

        } catch (error) {
            console.log("Error in Users: ", error)
            res.status(500).json({
                success: false,
                message: "Error in user update"
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
                message: "Error in username check"
            });
        }

    });

    router.get("/", async (req, res) => {
        try {
            const users = await UserService.getUsers();
            res.status(200).json({
                success: true,
                users: users
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
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
                message: error
            });
        }

    });


    return router;

}

module.exports.userRoutes = userRoutes