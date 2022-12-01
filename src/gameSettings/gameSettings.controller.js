const express = require('express');

function settingsRoutes(gameSettingService) {
    const router = express.Router();


    router.post('/', async (req, res) => {

        try {
            // const { category, isActive } = req.body;

            // if (!category) {
            //     throw Error("Incomplete Request details")
            // }

            let data = req.body

            const settingsData = await gameSettingService.saveOrUpdateSettings(data);

            res.status(200).json({
                success: true,
                settings: settingsData
            });


        } catch (err) {
            // return next(err);
            // console.log("reg erro: ", err)
            res.json({ success: false, message: err.message });
        }
    });



    router.post('/setGameWeek', async (req, res) => {

        try {
            const { gameWeek } = req.body;

            if (!gameWeek) {
                throw Error("Incomplete Request details")
            }

            // let data = req.body

            const settingsData = await gameSettingService.setCurrentGameWeek(gameWeek);

            res.status(200).json({
                success: true,
                settings: settingsData
            });


        } catch (err) {
            // return next(err);
            // console.log("reg erro: ", err)
            res.json({ success: false, message: err.message });
        }
    });



    router.get('/', async (req, res) => {

        try {
            const settings = await gameSettingService.getSettings();
            res.status(200).json({
                success: true,
                settings: settings
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });

    router.get('/buyList', async (req, res) => {

        try {
            const data = await gameSettingService.getBuyList();
            res.status(200).json({
                success: true,
                data: data
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });


    router.get('/game', async (req, res) => {

        try {
            const settings = await gameSettingService.getGameSettings();
            res.status(200).json({
                success: true,
                data: settings
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

module.exports.settingsRoutes = settingsRoutes