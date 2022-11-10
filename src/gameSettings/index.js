
const GameSetting = require('./gameSettings.model')
const GameSettingService = require('./gameSettings.service')


const gameSettingService = GameSettingService(GameSetting);

module.exports = {
    gameSettingService: gameSettingService,
    GameSetting: GameSetting,
    // QuestionController: QuestionController.questionRoutes(questionService)
}