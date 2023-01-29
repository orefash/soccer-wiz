"use strict";
const Question = require('./question.model');
const QuestionService = require('./question.service');
const QuestionController = require('./question.controller');


const { userService } = require('../user');
const { gameCategoryService } = require('../gameCategory');
const { gameSettingService } = require('../gameSettings');
const { gameWeekService } = require('../gameWeek')

const questionService = QuestionService(Question, userService, gameCategoryService, gameSettingService, gameWeekService);

module.exports = {
    questionService: questionService,
    Question: Question,
    QuestionController: QuestionController.questionRoutes(questionService)
}