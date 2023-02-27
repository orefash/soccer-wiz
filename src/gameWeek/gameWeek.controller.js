"use strict";
const express = require('express');
const requireAdminJwtAuth = require('../middleware/requireAdminJwtAuth');
const requireJwtAuth = require('../middleware/requireUserJwtAuth');

function gameWeekRoutes(gameWeekService) {
    const router = express.Router();

    router.post('/', requireAdminJwtAuth, async (req, res, next) => {

        try {
            const data = req.body;

            const gameData = await gameWeekService.addGameWeek(data);

            res.status(200).json({
                success: true,
                game: gameData
            });


        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    });

    router.post('/update-status', requireAdminJwtAuth, async (req, res, next) => {

        try {

            const gameData = await gameWeekService.updateGameweekStatus();

            res.status(200).json({
                success: true,
                status: gameData
            });


        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    });

    router.patch('/:id', requireAdminJwtAuth, async (req, res, next) => {

        try {
            const gameWeekId = req.params.id;
            const data = req.body;

            const gameData = await gameWeekService.updateGameWeek(gameWeekId, data);

            res.status(200).json({
                success: true,
                game: gameData
            });


        } catch (err) {
            res.json({ success: false, message: err.message });
        }
    });

    router.get("/",requireAdminJwtAuth, async (req, res) => {
        try {
            const gameWeeks = await gameWeekService.getGameWeeks();
            res.status(200).json({
                success: true,
                gameWeeks: gameWeeks
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }

    });

    router.get("/:gameWeek", async (req, res) => {
        try {

            const gameWeek = req.params.gameWeek;
            if(!gameWeek) throw new Error('Invalid Gameweek')

            const data = await gameWeekService.getGameByWeek(gameWeek);

            if (data) {
                res.status(200).json({
                    success: true,
                    gameWeek: data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "GameWeek not found"
                });
            }


        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }

    });

    router.get("/category/:category/info", requireAdminJwtAuth, async (req, res) => {
        try {

            const category = req.params.category;
            if(!category) throw new Error('Invalid Category')

            const data = await gameWeekService.getGameweekQuestionInfo(category);

            if (data) {
                res.status(200).json({
                    success: true,
                    data: data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Data not found"
                });
            }


        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });

    router.get("/category/:category/list", requireJwtAuth, async (req, res) => {
        try {

            const category = req.params.category;
            if(!category) throw new Error('Invalid Category')

            const data = await gameWeekService.getGameweekList(category);

            if (data) {
                res.status(200).json({
                    success: true,
                    data: data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Data not found"
                });
            }


        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    router.delete('/:id', async (req, res) => {

        try {
            let weekId = req.params.id;

            if(!weekId) throw new Error('No weekDay Id')
            const data = await gameWeekService.deleteGameWeek(weekId);
            res.status(200).json({
                success: data
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

module.exports.gameWeekRoutes = gameWeekRoutes