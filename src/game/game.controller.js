"use strict";
const express = require('express');
const requireJwtAuth = require('../middleware/requireUserJwtAuth');

function gameRoutes(gameService) {
    const router = express.Router();


    router.post('/submit',requireJwtAuth, async (req, res) => {

        try {
            const { 
                gameWeek,
                category,
                player,
                answers
            } = req.body;

            if (!category || !gameWeek || !player || !answers ) {
                throw new Error(`Incomplete Request Params: `)
            }

            let data = req.body;
            data.today = new Date()

            const gameData = await gameService.submitGame(data);

            res.status(200).json({
                success: true,
                gameData: gameData
            });


        } catch (err) {
            // return next(err);
            // console.log("reg erro: ", err)
            res.json({ success: false, message: err.message });
        }
    });

    router.get('/', async (req, res) => {

        try {
            const games = await gameService.getGames();
            res.status(200).json({
                success: true,
                games: games
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


module.exports.gameRoutes = gameRoutes;