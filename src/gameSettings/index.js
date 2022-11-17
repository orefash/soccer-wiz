
const GameSetting = require('./gameSettings.model')
const GameSettingService = require('./gameSettings.service')
const GameSettingController = require('./gameSettings.controller')

const { gameCategoryService } = require('../gameCategory')

const gameSettingService = GameSettingService(GameSetting, gameCategoryService);

module.exports = {
    gameSettingService: gameSettingService,
    GameSettingService: GameSettingService,
    GameSetting: GameSetting,
    GameSettingController: GameSettingController.settingsRoutes(gameSettingService)
}