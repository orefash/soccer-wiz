const express = require('express');
const requireJwtAuth = require('../middleware/requireUserJwtAuth');

function rewardRoutes(rewardService) {
    const router = express.Router();


    router.get('/', async (req, res) => {

        try {
            
            const rewards = await rewardService.getRewards();
            res.status(200).json({
                success: true,
                rewards: rewards
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });

    router.get('/user/:userId',requireJwtAuth, async (req, res) => {

        try {
            let uid = req.params.userId;

            const rewards = await rewardService.getRewardsByUser(uid);
            res.status(200).json({
                success: true,
                rewards: rewards
            });

        } catch (error) {
            console.log('Re error: ', error)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });


    


    router.post("/claim",requireJwtAuth, async (req, res) => {
        try {
            const { rewardId, userId } = req.body;

            if (!rewardId || !userId ) {
                throw Error("Incomplete Request details")
            }

            const rewardData = req.body;

            const claimedReward = await rewardService.claimReward(rewardData);

            res.status(200).json({
                success: true,
                reward: claimedReward
            });

        } catch (error) {
            // console.log("Error in rewards: ", error.message)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });



    router.post("/:id/issue",requireJwtAuth, async (req, res) => {
        try {
            const id = req.params.id;

            const issued = await rewardService.issueReward(id);

            res.status(200).json({
                success: true,
                reward: issued
            });

        } catch (error) {
            // console.log("Error in rewards: ", error.message)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    return router;

}

module.exports.rewardRoutes = rewardRoutes