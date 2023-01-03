const { connect, clearDatabase, closeDatabase } = require('../db')

const { GameWeek, gameWeekService } = require('../../gameWeek')

const gameWeekStub = require('../stubs/gameWeek.stub')

beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())


describe('GameWeek Service', () => {
    describe('addGameWeek', () => {
        it('should save game week', async () => {

            let game = await gameWeekService.addGameWeek(gameWeekStub.valid)

            expect(game.gameWeek).toEqual(gameWeekStub.valid.gameWeek);
        })

        it('should throw exception if parameters are incomplete', async () => {

            await expect(gameWeekService.addGameWeek(gameWeekStub.invalid)).rejects.toThrow()
        })

    })

    describe('getGameWeeks', () => {
        it('should fetch game weeks', async () => {

            await gameWeekService.addGameWeek(gameWeekStub.valid);
            let games = await gameWeekService.getGameWeeks();

            expect(games.length).toEqual(1)
        })

    })

    describe('getGameByWeek', () => {
        it('should fetch game by week', async () => {

            await gameWeekService.addGameWeek(gameWeekStub.valid);
            
            let game = await gameWeekService.getGameByWeek(gameWeekStub.valid.gameWeek);

            expect(game.gameWeek).toEqual(gameWeekStub.valid.gameWeek)
        })

    })

    describe('deleteGameWeek', () => {
        it('should delete gameWeek', async () => {

            let created = await gameWeekService.addGameWeek(gameWeekStub.valid);

            let data = await gameWeekService.deleteGameWeek(created._id);

            expect(data).toBeTruthy();
        })

    })

    describe('updateGameWeek', () => {
        it('should fetch game by week', async () => {

            let created = await gameWeekService.addGameWeek(gameWeekStub.valid);

            let updateData = {
                status: "LIVE"
            }
            let game = await gameWeekService.updateGameWeek(created._id, updateData);

            expect(game.gameWeek).toEqual(gameWeekStub.valid.gameWeek)
            expect(game.status).toEqual(updateData.status)
        })

    })
})