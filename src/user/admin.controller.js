const express = require('express');
const router = express.Router();

const requireAdminJwtAuth = require('../middleware/requireAdminJwtAuth');

function adminRoutes(UserService) {
    const router = express.Router();

    router.get('/me', requireAdminJwtAuth, async (req, res) => {
        // console.log("in admin me")
        let user = req.user.toAdminJSON();
        res.json({
            success: true,
            user: user
        });
    });

    

    return router;

}

module.exports.adminRoutes = adminRoutes