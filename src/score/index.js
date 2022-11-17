const DailyScore = require('./models/dailyScore.model')
const WeeklyScore = require('./models/weeklyScore.model')
const MonthlyScore = require('./models/monthlyScore.model')
const Score = require('./models/score.model')

const ScoreService = require('./score.service')
const ScoreController = require('./score.controller')

// const { userService } = require('../user')
// const { gameCategoryService } = require('../gameCategory')
// const { gameSettingService } = require('../gameSettings')

const scoreService = ScoreService(DailyScore, WeeklyScore, MonthlyScore, Score);

module.exports = {
    scoreService: scoreService,
    DailyScore: DailyScore,
    WeeklyScore: WeeklyScore,
    MonthlyScore: MonthlyScore,
    ScoreController: ScoreController.scoreRoutes(scoreService)
}