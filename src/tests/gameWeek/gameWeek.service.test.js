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

const addDays = (date, nos) => {
    date.setDate(date.getDate() + nos);
    return date;
};


const gameWeekStub = require('../stubs/gameWeek.stub');

beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())


describe('GameWeek Service', () => {
    let gameWeekService = GameWeekService(GameWeek, questionService);

    describe('addGameWeek', () => {
        it('should save game week and set correct status', async () => {

            // new Date().toISOString().split('T')[0]
            let d1 = addDays(new Date(), 1);
            let d2 = addDays(new Date(), 2);
            let d_2 = addDays(new Date(), -2);
            let d_1 = addDays(new Date(), -1);
            let d = new Date().toISOString().split('T')[0];
            

            let passed = {
                startDate: d_2, endDate: d_1, title: 'Gameweek 1',
            }
            let live1 = {
                startDate: d_2, endDate: d2, title: 'Gameweek 2',
            }
            let live2 = {
                startDate: d, endDate: d1, title: 'Gameweek 3',
            }
            let live3 = {
                startDate: d, endDate: d, title: 'Gameweek 4',
            }
            let schd = {
                startDate: d1, endDate: d2, title: 'Gameweek 5',
            }

            let game = await gameWeekService.addGameWeek(passed);
            let game1 = await gameWeekService.addGameWeek(live1);
            let game2 = await gameWeekService.addGameWeek(live2);
            let game4 = await gameWeekService.addGameWeek(schd);
            let game3 = await gameWeekService.addGameWeek(live3);

            expect(game.title).toEqual(passed.title);
            expect(game.status).toEqual('Passed');
            expect(game1.status).toEqual('Live');
            expect(game4.status).toEqual('Scheduled');
            expect(game3.status).toEqual('Live');
            expect(game2.status).toEqual('Live');
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
            let q4 = await new Question(questionData(g2.id, "PL")).save();

            let gamesList = await gameWeekService.getGameWeeks();

            let games = await gameWeekService.getGameweekQuestionInfo('General');


            expect(gamesList.length).toEqual(3)
            expect(games.length).toEqual(3)
            expect(games[0].Questions).toEqual(0)
            expect(games[1].Questions).toEqual(1)
            expect(games[2].Questions).toEqual(2)
        });

    })


    describe('getGameweekList', () => {
        it('should fetch game week live/upcoming game cat list', async () => {

            let valid = {
                startDate: '01/01/2022', endDate: '08/01/2022', title: 'Gameweek 1', status: "Live"
            }
            let valid2 = {
                startDate: '01/01/2022', endDate: '08/01/2022', title: 'Gameweek 1', status: "Live"
            }
            let valid3 = {
                startDate: '01/01/2022', endDate: '08/01/2022', title: 'Gameweek 1', status: "Scheduled"
            }
            let valid4 = {
                startDate: '01/01/2022', endDate: '08/01/2022', title: 'Gameweek 1', status: "Passed"
            }

            let g1 = await gameWeekService.addGameWeek(valid);
            let g2 = await gameWeekService.addGameWeek(valid2);
            let g3 = await gameWeekService.addGameWeek(valid3);
            let g4 = await gameWeekService.addGameWeek(valid4);


            let q1 = await new Question(questionData(g1.id, "General")).save();
            let q2 = await new Question(questionData(g3.id, "Sport")).save();
            let q3 = await new Question(questionData(g3.id, "General")).save();

            let gamesList = await gameWeekService.getGameweekList('General');


            expect(gamesList.live.length).toEqual(1)
            expect(gamesList.upcoming.length).toEqual(1)
        });

    })

    describe('updateGameweekStatus', () => {
        it('should set gameweeks to live or Passed based on date', async () => {

            

            function dateToEpoch() {
                return new Date().toISOString().split('T')[0];
            }

            let past = {
                startDate: addDays(new Date(), -6), endDate: addDays(new Date(), -4), title: 'Gameweek 1'
            }
            
            let current = {
                startDate: addDays(new Date(), -2), endDate: addDays(new Date(), 2), title: 'Gameweek 2'
            }

            let current2 = {
                startDate: addDays(new Date(), -2), endDate: new Date().toISOString().split('T')[0], title: 'Gameweek 21'
            }

            let current3 = {
                startDate: new Date().toISOString().split('T')[0], endDate: addDays(new Date(), 1), title: 'Gameweek 21'
            }

            let cToday = {
                startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], title: 'Gameweek 21'
            }

            let after = {
                startDate: addDays(new Date(), 2), endDate: addDays(new Date(), 4), title: 'Gameweek 3'
            }

            let g1 = await gameWeekService.addGameWeek(past);
            let g2 = await gameWeekService.addGameWeek(current);
            let g3 = await gameWeekService.addGameWeek(after);
            let g4 = await gameWeekService.addGameWeek(current2);
            let g5 = await gameWeekService.addGameWeek(current3);
            let g6 = await gameWeekService.addGameWeek(cToday);

            // console.log("g4: ", g4)
            // console.log("g5: ", g5)
            // console.log("g6: ", g6)

            // console.log("today: ", new Date())

            let nDate = dateToEpoch();


            // console.log("ntoday: ", nDate);

            // const check = g4.endDate < new Date() ? 'is before' : 'is not before';

            // console.log('check: ', check)



            let games = await gameWeekService.getGameWeeks();
            // console.log('Gs: ', games)

            let statusUpdate = await gameWeekService.updateGameweekStatus();

            // console.log('Update Gs: ', statusUpdate)
           
            let ngames = await gameWeekService.getGameWeeks();
            // console.log('uGs: ', ngames)

            expect(statusUpdate).toEqual(true);
            expect(ngames[0].status).toEqual('Passed');
            expect(ngames[1].status).toEqual('Live');
            expect(ngames[2].status).toEqual('Scheduled');
            expect(ngames[3].status).toEqual('Live');
            expect(ngames[4].status).toEqual('Live');
            expect(ngames[5].status).toEqual('Live');
        });

    })

    describe('getGameById', () => {
        it('should fetch game by week', async () => {

            let created = await gameWeekService.addGameWeek(gameWeekStub.valid);

            let game = await gameWeekService.getGameById(created.id);

            expect(game.title).toEqual(gameWeekStub.valid.title)
        })
        it('should return null if gameweek doesnt exist', async () => {

            let id = '63c8e9dea08a3244b63e9d05';
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