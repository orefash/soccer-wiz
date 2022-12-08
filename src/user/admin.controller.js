const express = require('express');
const router = express.Router();

const requireAdminJwtAuth = require('../middleware/requireAdminJwtAuth');

function adminRoutes(UserService) {
    const router = express.Router();

    router.get('/me', requireAdminJwtAuth, async (req, res) => {
        console.log("in admin me")
        let user = req.user.toAdminJSON();
        res.json({
            success: true,
            user: user
        });
    });

    router.patch("/:id/username", async (req, res) => {
        try {
            const { username } = req.body;
            const userId = req.params.id;


            if(!username) throw new Error('Invalid username')

            if(!userId) throw new Error('Invalid User ID')

            const userData = {
                username
            }

            const updatedUser = await UserService.updateUsername(userId, userData);

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

    router.patch("/:id/toggleStatus", async (req, res) => {
        try {
            const userId = req.params.id;

            if(!userId) throw new Error("User ID is invalid")

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
            let a =  null;
           
            a = await UserService.getUsers();
            data.users = a;
            data.success = true;
            res.status(200).json(data);

        } catch (error) {
            console.log("error: ",error.message)
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

module.exports.adminRoutes = adminRoutes