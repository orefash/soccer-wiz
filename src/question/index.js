const Question = require('./question.model')
const QuestionService = require('./question.service')
const QuestionController = require('./question.controller')

const questionService = QuestionService(Question);

module.exports = {
    // QuestionService: questionService,
    QuestionController: QuestionController.questionRoutes(questionService)
}