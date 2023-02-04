"use strict";
const GameWeek = require('./gameWeek.model');
const GameWeekService = require('./gameWeek.service');
const GameWeekController = require('./gameWeek.controller');


const gameWeekService = GameWeekService(GameWeek);

module.exports = {
    gameWeekService: gameWeekService,
    GameWeek: GameWeek,
    GameWeekService: GameWeekService,
    GameWeekController: GameWeekController.gameWeekRoutes(gameWeekService)
}