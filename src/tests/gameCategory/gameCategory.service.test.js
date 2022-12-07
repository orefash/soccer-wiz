
const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { GameCategory, gameCategoryService } = require('../../gameCategory')
// const GatewayTransactionService = require('../../gatewayTransaction/gatewayTransaction.service');

// const gatewayTransactionService = GatewayTransactionService(GatewayTransaction)


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())


const gameCategory1 = {   category: 'PL' , description: 'PL game questions' }
const gameCategory2 = { category: 'SerieA', description: 'SerieA game questions'  }
const gameCategory3 = { category: 'World Cup', description: 'World Cup game questions' , isActive: false }

describe('Game Category Service', () => {

    describe('saveCategory', () => {
        it('should save game category', async () => {

            const savedCategory = await gameCategoryService.saveCategory(gameCategory1);

            // await gameSettingService.saveSettings(gameSetting);

            expect(savedCategory.category).toBe('PL')


        })
    })

    describe('getCategories', () => {
        it('should return game categories', async () => {

            await gameCategoryService.saveCategory(gameCategory1);
            await gameCategoryService.saveCategory(gameCategory2);
            await gameCategoryService.saveCategory(gameCategory3);

            let categories = await gameCategoryService.getCategories();

            // console.log("cats: ", categories)

            expect(categories.length).toBe(3)


        })
    })

    describe('getCategories', () => {
        it('should return active game categories when active != 1', async () => {

            await gameCategoryService.saveCategory(gameCategory1);
            await gameCategoryService.saveCategory(gameCategory2);
            await gameCategoryService.saveCategory(gameCategory3);

            let categories = await gameCategoryService.getCategories(0);

            // console.log("cats: ", categories)

            expect(categories.length).toBe(2)


        })
    })


    describe('getCategories', () => {
        it('should return active game categories when active != 1', async () => {

            await gameCategoryService.saveCategory(gameCategory1);
            await gameCategoryService.saveCategory(gameCategory2);
            await gameCategoryService.saveCategory(gameCategory3);

            let categories = await gameCategoryService.getCategories(0);

            // console.log("cats: ", categories)

            expect(categories.length).toBe(2)


        })
        it('should return all game categories when active = 1', async () => {

            await gameCategoryService.saveCategory(gameCategory1);
            await gameCategoryService.saveCategory(gameCategory2);
            await gameCategoryService.saveCategory(gameCategory3);

            let categories = await gameCategoryService.getCategories(1);

            // console.log("cats: ", categories)

            expect(categories.length).toBe(3)


        })
    })

    describe('deleteCategory', () => {
        it('should delete category when given the id', async () => {

            await gameCategoryService.saveCategory(gameCategory1);
            await gameCategoryService.saveCategory(gameCategory2);
            let cat = await gameCategoryService.saveCategory(gameCategory3);

            let categories1 = await gameCategoryService.getCategories(1);

            let data = await gameCategoryService.deleteCategory(cat._id)

            let categories2 = await gameCategoryService.getCategories(1);

            // console.log("cats: ", categories1)
            // console.log("del data: ", data)
            // console.log("cats 2: ", categories2)

            expect(categories1.length).toBe(3)
            expect(categories2.length).toBe(2)

        })
    })

    describe('deleteAllCategories', () => {
        it('should delete all categories', async () => {

            await gameCategoryService.saveCategory(gameCategory1);
            await gameCategoryService.saveCategory(gameCategory2);
            await gameCategoryService.saveCategory(gameCategory3);

            let categories1 = await gameCategoryService.getCategories(1);

            let data = await gameCategoryService.deleteAllCategories()

            let categories2 = await gameCategoryService.getCategories(1);

            // console.log("cats: ", categories1)
            // console.log("del data: ", data)
            // console.log("cats 2: ", categories2)

            expect(categories1.length).toBe(3)
            expect(categories2.length).toBe(0)

        })
    })

    describe('getCategoryByName', () => {
        it('should return category by name', async () => {

            await gameCategoryService.saveCategory(gameCategory1);
            await gameCategoryService.saveCategory(gameCategory2);
            await gameCategoryService.saveCategory(gameCategory3);
            let cat = 'SerieA';

            let category = await gameCategoryService.getCategoryByName(cat);
            // console.log("cats: ", category)
            expect(category).not.toBe(null)
            expect(category.category).toBe(cat)

        })
    })

    describe('getCategoryByName', () => {
        it('should return null if category not exist', async () => {

            await gameCategoryService.saveCategory(gameCategory1);
            await gameCategoryService.saveCategory(gameCategory2);
            await gameCategoryService.saveCategory(gameCategory3);

            let cat = 'fb';
            let category = await gameCategoryService.getCategoryByName(cat);
            // console.log("cats: ", category)

            expect(category).toBe(null)
        })
    })

})