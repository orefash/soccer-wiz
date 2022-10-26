
const Game = require('./game.model')
const GameService = require('./games.service')

const { userService } = require('../user')

const gameService = GameService(Game, userService);

module.exports = {
    gameService: gameService,
    // Question: Question,
    // QuestionController: QuestionController.questionRoutes(questionService)
}