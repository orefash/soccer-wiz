
const Game = require('./game.model')
const GameService = require('./game.service')
const GameController = require('./game.controller')

const { userService } = require('../user')
const { scoreService } = require('../score')

const gameService = GameService(Game, userService, scoreService);


module.exports = {
    gameService: gameService,
    Game: Game,
    GameController: GameController.gameRoutes(gameService)
}