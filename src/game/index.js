
const Game = require('./game.model')
const GameService = require('./game.service')

const { userService } = require('../user')

const gameService = GameService(Game, userService);

module.exports = {
    gameService: gameService,
    Game: Game,
    // QuestionController: QuestionController.questionRoutes(questionService)
}