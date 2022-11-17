const express = require('express');
const router = express.Router();

const requireJwtAuth = require('../middleware/requireJwtAuth');

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

    router.patch("/details/:id", async (req, res) => {
        try {
            const { username, country } = req.body;

            const userData = {
                username, country
            }

            const updatedUser = await UserService.updateUsername(req.params.id, userData);

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
            // try {
            //     a = await UserService.getUsers();
            // } catch (error) {
            //     console.log('Error 1: ', error.message)
            // }

            // try {
            //     data.users = a;
            // } catch (error) {
            //     console.log('Error 2: ', error.message)
            // }

            // try {
            //     data.success = true;
            // } catch (error) {
            //     console.log('Error 3: ', error.message)
            // }

            a = await UserService.getUsers();
            data.users = a;
            data.success = true;
            res.status(200).json(data);
            // try {
                
            // } catch (error) {
            //     console.log('Error 4: ', error.message)
            // }
            // let uList = 
            // console.log("Users: ", JSON.stringify(uList))
            
            // console.log("in get users")
            // res.send("done")

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

module.exports.userRoutes = userRoutes