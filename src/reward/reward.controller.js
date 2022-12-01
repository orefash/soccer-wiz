const express = require('express');

function rewardRoutes(rewardService, userService) {
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

    router.get('/user/:userId', async (req, res) => {

        try {
            let uid = req.params.userId;

            let user = await userService.getUserById(uid)

            if(!user) throw new Error('User does not exist')

            const rewards = await rewardService.getRewardsByUser(uid);
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


    router.post("/", async (req, res) => {
        try {
            const { gameWeek, userId, value, currency, type } = req.body;

            // if (!question || !category || !answers) {
            //     throw Error("Incomplete Request details")
            // }

            let uid = userId;

            let user = await userService.getUserById(uid)

            if(!user) throw new Error('User does not exist')

            const rewardData = req.body;

            const savedReward = await rewardService.saveReward(rewardData);
            res.status(200).json({
                success: true,
                reward: savedReward
            });

        } catch (error) {
            console.log("Error in rewards: ", error.message)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    router.post("/claim", async (req, res) => {
        try {
            const { rewardId, userId } = req.body;

            // if (!question || !category || !answers) {
            //     throw Error("Incomplete Request details")
            // }

            // let uid = userId;

            let user = await userService.getUserById(userId)

            if(!user) throw new Error('User does not exist')

            const rewardData = req.body;

            const claimedReward = await rewardService.claimReward(rewardData);

            res.status(200).json({
                success: true,
                reward: claimedReward
            });

        } catch (error) {
            console.log("Error in rewards: ", error.message)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    return router;

}

module.exports.rewardRoutes = rewardRoutes