const { connect, clearDatabase, closeDatabase } = require('../db')

const GameWeek = require('../../gameWeek/gameWeek.model');
const GameWeekService = require('../../gameWeek/gameWeek.service');

const Question = require('../../question/question.model');

const { questionData } = require('../stubs/question.stub');


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

            let g1 = await gameWeekService.addGameWeek(gameWeekStub.valid);
            let g2 = await gameWeekService.addGameWeek(gameWeekStub.valid2);
            let g3 = await gameWeekService.addGameWeek(gameWeekStub.valid3);

            let q1 = await new Question(questionData(g1.id, "General")).save();
            let q2 = await new Question(questionData(g1.id, "General")).save();
            let q3 = await new Question(questionData(g2.id, "General")).save();
            

            let games = await gameWeekService.getGameweekQuestionInfo('General');

            expect(games.length).toEqual(3)
            expect(games[0].Questions).toEqual(0)
            expect(games[1].Questions).toEqual(1)
            expect(games[2].Questions).toEqual(2)
        });
   
    })

    describe('getGameById', () => {
        it('should fetch game by week', async () => {

            let created = await gameWeekService.addGameWeek(gameWeekStub.valid);
            
            let game = await gameWeekService.getGameById(created.id);

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