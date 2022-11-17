
const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { GameSetting, GameSettingService } = require('../../gameSettings')
// const GatewayTransactionService = require('../../gatewayTransaction/gatewayTransaction.service');

// const gatewayTransactionService = GatewayTransactionService(GatewayTransaction)


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())

let categories = [
    {
        "isActive": true,
        "_id": "636f550593cce015384f47e5",
        "category": "PL",
        "__v": 0
    },
    {
        "isActive": true,
        "_id": "636f61a96a526d1a4008d18b",
        "category": "Serie A",
        "__v": 0
    }
]

const getCategories = jest.fn();
when(getCategories).calledWith(0).mockReturnValue(categories)


let gameCategoryService = {
    getCategories: getCategories
}

const gameSettingService = GameSettingService(GameSetting, gameCategoryService);

const gameSetting = {
    
    creditBuyList: [
        10, 20, 50, 100
    ],
    currentGameWeek: 2,
    costPerCredit: 30,
    creditsPerGame: 10,
    minPointsForReward: 12,
    questionTimeLimit: 12,
    questionPerQuiz: 15
}

const gameSetting1 = {
   
    creditBuyList: [
        10, 20, 50, 100
    ],
    currentGameWeek: 3,
    costPerCredit: 30,
    creditsPerGame: 10,
    minPointsForReward: 12,
    questionTimeLimit: 12,
    questionPerQuiz: 15
}

describe('Game Settings Service', () => {

    describe('saveGameSettings', () => {
        it('should save game settings', async () => {

            const savedSettings = await gameSettingService.saveOrUpdateSettings(gameSetting);

            // await gameSettingService.saveSettings(gameSetting);

            expect(savedSettings.currentGameWeek).toBe(gameSetting.currentGameWeek)


        })
    })


    describe('saveGameSettings', () => {
        it('should overwrite game settings with new ones, always have one record at a time', async () => {

            const savedSettings = await gameSettingService.saveOrUpdateSettings(gameSetting);

            await gameSettingService.saveOrUpdateSettings(gameSetting1);

            await gameSettingService.saveOrUpdateSettings(gameSetting);


            let settings = await gameSettingService.getSettings();


            expect(settings).not.toBe(null)

            expect(settings.currentGameWeek).toBe(2)


        })
    })

    describe('getSettings', () => {
        it('should return game settings', async () => {

            await gameSettingService.saveOrUpdateSettings(gameSetting1);

            let settings = await gameSettingService.getSettings();

            // console.log("Settings: ", settings)
            // console.log("Settings Cat: ", settings[0].categories)

            expect(settings).not.toBe(null)

            expect(settings.currentGameWeek).toBe(3)

        })
    })

    describe('getSettings', () => {
        it('should return game settings', async () => {

            await gameSettingService.saveOrUpdateSettings(gameSetting1);

            let settings = await gameSettingService.getSettings();

            // console.log("Settings: ", settings)
            // console.log("Settings Cat: ", settings[0].categories)

            expect(settings).not.toBe(null)

            expect(settings.currentGameWeek).toBe(3)

        })
    })

    describe('getGameSettings', () => {
        it('should return game settings with categories', async () => {

            await gameSettingService.saveOrUpdateSettings(gameSetting1);

            let settings = await gameSettingService.getGameSettings();

            // console.log("Settings: ", settings)

            expect(settings.settings.currentGameWeek).toBe(3)
            expect(settings.categories.length).toBe(2)


        })
    })


    // describe('getActiveCategories', () => {
    //     it('should return active categories', async () => {

    //         await gameSettingService.saveOrUpdateSettings(gameSetting);

    //         let settingD = await gameSettingService.getSettings();

    //         console.log("Settings D: ", settingD)

    //         let settings = await gameSettingService.getActiveCategories();

    //         console.log("Settings C: ", settings)
    //         // console.log("Settings Cat: ", settings[0].categories)

    //         expect(settings.length).toBe(1)

    //         // expect(settings[0].currentGameWeek).toBe(3)

    //     })
    // })
    
    // describe('updateSettings', () => {
    //     it('should update categories in game settings', async () => {

    //         await gameSettingService.saveOrUpdateSettings(gameSetting1);

    //         let settings = await gameSettingService.getSettings();

    //         // console.log("Settings: ", settings)

    //         let updatedSettings = await gameSettingService.updateSetting(settings)

    //         expect(settings.length).toBe(1)

    //         expect(settings[0].currentGameWeek).toBe(3)

    //     })
    // })


})