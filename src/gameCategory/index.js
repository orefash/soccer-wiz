
const GameCategory = require('./gameCategory.model')
const GameCategoryService = require('./gameCategory.service')
const GameCategoryController = require('./gameCategory.controller')

const gameCategoryService = GameCategoryService(GameCategory);

module.exports = {
    gameCategoryService: gameCategoryService,
    GameCategory: GameCategory,
    GameCategoryController: GameCategoryController.categoryRoutes(gameCategoryService)
}