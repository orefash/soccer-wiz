const Question = require('./question.model')
const QuestionService = require('./question.service')
const QuestionController = require('./question.controller')

const { userService } = require('../user')

const questionService = QuestionService(Question, userService);

module.exports = {
    // QuestionService: questionService,
    QuestionController: QuestionController.questionRoutes(questionService)
}