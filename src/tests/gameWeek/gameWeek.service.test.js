const { connect, clearDatabase, closeDatabase } = require('../db')

const GameWeek = require('../../gameWeek/gameWeek.model');
const GameWeekService = require('../../gameWeek/gameWeek.service');

let questionService = {}
let data = [
    {
        "count": 90,
        "gameWeek": 3,
        "status": "Scheduled",
        "startDate": "2023-09-02T00:00:00.000Z"
    }
]

let getGameWeekQuestionData = jest.fn().mockReturnValue(data);

questionService.getGameWeekQuestionData = getGameWeekQuestionData;



const gameWeekStub = require('../stubs/gameWeek.stub');

beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())


describe('GameWeek Service', () => {
    let gameWeekService = GameWeekService(GameWeek, questionService);

    describe('addGameWeek', () => {
        it('should save game week', async () => {

            let game = await gameWeekService.addGameWeek(gameWeekStub.valid);

            expect(game.title).toEqual(gameWeekStub.valid.title);
        })

        it('should throw exception if parameters are incomplete', async () => {

            await expect(gameWeekService.addGameWeek(gameWeekStub.invalid)).rejects.toThrow()
        })

        it('should throw exception if time is invalid', async () => {

            await expect(gameWeekService.addGameWeek(gameWeekStub.invalidTime)).rejects.toThrow()
        })

    })

    describe('getGameWeeks', () => {
        it('should fetch game weeks', async () => {

            await gameWeekService.addGameWeek(gameWeekStub.valid);
            let games = await gameWeekService.getGameWeeks();

            expect(games.length).toEqual(1)
        })

    })

    describe('getGameweekQuestionInfo', () => {
        it('should fetch game week Info for game cat list', async () => {

            await gameWeekService.addGameWeek(gameWeekStub.valid);
            await gameWeekService.addGameWeek(gameWeekStub.valid2);

            let games = await gameWeekService.getGameweekQuestionInfo('category');

            
            expect(games.length).toEqual(3)
            expect(questionService.getGameWeekQuestionData).toBeCalledTimes(1);
        });
        it("return error message and throw exception ßif error occurs", async () => {
            questionService.getGameWeekQuestionData.mockImplementationOnce(() => {
                throw new Error();
            });

            await gameWeekService.addGameWeek(gameWeekStub.valid);
            await gameWeekService.addGameWeek(gameWeekStub.valid2);

            await expect(gameWeekService.getGameweekQuestionInfo('category')).rejects.toThrow();

            // expect(games.length).toEqual(3)
            expect(questionService.getGameWeekQuestionData).toBeCalled();
        });
        it('should return game week list alone if category call is empty', async () => {

            questionService.getGameWeekQuestionData.mockReturnValue([]);
            await gameWeekService.addGameWeek(gameWeekStub.valid);
            await gameWeekService.addGameWeek(gameWeekStub.valid2);

            let games = await gameWeekService.getGameweekQuestionInfo('category');


            expect(games.length).toEqual(2)
            expect(questionService.getGameWeekQuestionData).toBeCalled();
        });
    })

    describe('getGameById', () => {
        it('should fetch game by week', async () => {

            let created = await gameWeekService.addGameWeek(gameWeekStub.valid);
            
            let game = await gameWeekService.getGameById(created.id);

            console.log('g game: ', game);

            expect(game.title).toEqual(gameWeekStub.valid.title)
        })
        it('should return null if gameweek doesnt exist', async () => {

            let id ='63c8e9dea08a3244b63e9d05';
            let game = await gameWeekService.getGameById(id);

            expect(game).toBeNull();
        })

    })

    describe('deleteGameWeek', () => {
        it('should delete gameWeek', async () => {

            let created = await gameWeekService.addGameWeek(gameWeekStub.valid);

            let data = await gameWeekService.deleteGameWeek(created.id);

            expect(data).toBeTruthy();
        })

    })

    describe('updateGameWeek', () => {
        it('should update game week', async () => {

            let created = await gameWeekService.addGameWeek(gameWeekStub.valid);

            let updateData = {
                status: "LIVE"
            }
            let game = await gameWeekService.updateGameWeek(created.id, updateData);


            expect(game.gameWeek).toEqual(gameWeekStub.valid.gameWeek)
            expect(game.status).toEqual(updateData.status)
        })

    })
})