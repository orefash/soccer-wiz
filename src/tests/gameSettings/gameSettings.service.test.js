
const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { GameSetting, gameSettingService } = require('../../gameSettings')
// const GatewayTransactionService = require('../../gatewayTransaction/gatewayTransaction.service');

// const gatewayTransactionService = GatewayTransactionService(GatewayTransaction)


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())

const gameSetting = {
    categories: [
        {   category: 'PL' }, { category: 'SerieA' }
    ],
    creditBuyList: [
        10, 20, 50, 100
    ],
    currentGameWeek: 2,
    costPerCredit: 30,
    creditsPerGame: 10,
    minPointsForReward: 12
}

const gameSetting1 = {
    categories: [
        {   category: 'PL1' }, { category: 'SerieA' }
    ],
    creditBuyList: [
        10, 20, 50, 100
    ],
    currentGameWeek: 3,
    costPerCredit: 30,
    creditsPerGame: 10,
    minPointsForReward: 12
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


            expect(settings.length).toBe(1)

            expect(settings[0].currentGameWeek).toBe(2)


        })
    })

    describe('getSettings', () => {
        it('should return game settings', async () => {

            await gameSettingService.saveOrUpdateSettings(gameSetting1);

            let settings = await gameSettingService.getSettings();

            console.log("Settings: ", settings)
            console.log("Settings Cat: ", settings[0].categories)

            expect(settings.length).toBe(1)

            expect(settings[0].currentGameWeek).toBe(3)

        })
    })

    
    describe('updateSettings', () => {
        it('should update categories in game settings', async () => {

            await gameSettingService.saveOrUpdateSettings(gameSetting1);

            let settings = await gameSettingService.getSettings();

            // console.log("Settings: ", settings)

            let updatedSettings = await gameSettingService.updateSetting(settings)

            expect(settings.length).toBe(1)

            expect(settings[0].currentGameWeek).toBe(3)

        })
    })


})