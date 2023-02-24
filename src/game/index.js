"use strict";
const Game = require('./game.model');
const GameService = require('./game.service');
const GameController = require('./game.controller');

const { scoreService } = require('../score');

const User = require('../user/user.model');
const UserService = require('../user/user.service');

const GameWeek = require('../gameWeek/gameWeek.model');

const { rewardService } = require('../reward');

const gameService = GameService(Game, UserService(User), scoreService, GameWeek, rewardService);


module.exports = {
    gameService: gameService,
    Game: Game,
    GameController: GameController.gameRoutes(gameService)
}