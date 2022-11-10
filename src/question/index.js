const Question = require('./question.model')
const QuestionService = require('./question.service')
const QuestionController = require('./question.controller')

const { userService } = require('../user')

const questionService = QuestionService(Question, userService);

module.exports = {
    questionService: questionService,
    Question: Question,
    QuestionController: QuestionController.questionRoutes(questionService)
}