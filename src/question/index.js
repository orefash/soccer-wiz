const Question = require('./question.model')
const QuestionService = require('./question.service')
const QuestionController = require('./question.controller')

const { userService } = require('../user')
const { gameCategoryService } = require('../gameCategory')
const { gameSettingService } = require('../gameSettings')

const questionService = QuestionService(Question, userService, gameCategoryService, gameSettingService);

module.exports = {
    questionService: questionService,
    Question: Question,
    QuestionController: QuestionController.questionRoutes(questionService)
}