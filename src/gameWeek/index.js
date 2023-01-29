"use strict";
const GameWeek = require('./gameWeek.model');
const GameWeekService = require('./gameWeek.service')
const GameWeekController = require('./gameWeek.controller')


const { questionService } = require('../question');
const gameWeekService = GameWeekService(GameWeek, questionService)

module.exports = {
    gameWeekService: gameWeekService,
    GameWeek: GameWeek,
    GameWeekService: GameWeekService,
    GameWeekController: GameWeekController.gameWeekRoutes(gameWeekService)
}