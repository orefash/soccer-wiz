const express = require('express');

function scoreRoutes(ScoreService) {
    const router = express.Router();

    router.post('/', async (req, res) => {

        try {
            // const { category, isActive } = req.body;

            // if (!category) {
            //     throw Error("Incomplete Request details")
            // }

            let data = req.body

            const scoreData = await ScoreService.saveScore(data)

            res.status(200).json({
                success: true,
                settings: scoreData
            });


        } catch (err) {
            // return next(err);
            // console.log("reg erro: ", err)
            res.json({ success: false, message: err.message });
        }
    });


    router.get('/leaderboard/user/:userId/category/:category', async (req, res) => {

        try {
            let period = req.query.period;
            // let username = req.query.username;
            let userId = req.params.userId;
            let category = req.params.category;

            if(!userId || !category || !period ) throw new Error('Incomplete parameters')

            let data = { period, userId, category }
            // console.log('Data: ', data)
            const leaderboard = await ScoreService.getLeaderboardByCategory(data);
            res.status(200).json({
                success: true,
                data: leaderboard
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });



    router.get('/leaderboard/matchday/user/:userId', async (req, res) => {

        try {
            let username = req.query.username;
            let userId = req.params.userId;

            if(!userId  || !username) throw new Error('Incomplete Parameters!!')

            let data = { username, userId }
            // console.log('Data: ', data)
            const leaderboard = await ScoreService.getMatchdayLeaderboard(data);
            res.status(200).json({
                success: true,
                data: leaderboard
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
        
    });


    router.get('/', async (req, res) => {

        try {
           let period = req.query.period;
           if(!period) throw new Error('Period param missing!!')
            // console.log('Data: ', data)
            const scores = await ScoreService.getScores(period);
            res.status(200).json({
                success: true,
                scores: scores
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });



    return router;
}

module.exports.scoreRoutes = scoreRoutes;