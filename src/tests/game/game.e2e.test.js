const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const Game = require('../../game/game.model');
const GameService = require('../../game/game.service');

const User = require('../../user/user.model');
const UserService = require('../../user/user.service');
const userService = UserService(User);

const { ScoreService, DailyScore, WeeklyScore, MonthlyScore, Score } = require('../../score');


let category1 = 'General';

const getCategoryByName = jest.fn();
when(getCategoryByName).calledWith(category1).mockReturnValue(true);

let gameCategoryService = {
    getCategoryByName: getCategoryByName
}

const gameWeekStub = require('../stubs/gameWeek.stub');
const GameWeek = {
    findOne: jest.fn().mockReturnValue(gameWeekStub.valid0)
}

const scoreService = ScoreService(DailyScore, WeeklyScore, MonthlyScore, Score, gameCategoryService);

const { rewardService } = require('../../reward');

const gameService = GameService(Game, userService, scoreService, GameWeek, rewardService);



const getGameData = require('../stubs/game.stub');

beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())

const gameAnswers1 = [
    {
        timeTaken: 5,
        isCorrect: true
    },
    {
        timeTaken: 5,
        isCorrect: false
    },
    {
        timeTaken: 2,
        isCorrect: true
    },
    {
        timeTaken: 8,
        isCorrect: false
    },
    {
        timeTaken: 9,
        isCorrect: true
    },
    {
        timeTaken: 5,
        isCorrect: true
    }
]

const gameAnswers2 = [
    {
        "timeTaken": 9,
        "isCorrect": true
    },
    {
        "timeTaken": 5,
        "isCorrect": false
    },
    {
        "timeTaken": 2,
        "isCorrect": true
    },
    {
        "timeTaken": 8,
        "isCorrect": false
    },
    {
        "timeTaken": 9,
        "isCorrect": true
    },
    {
        "timeTaken": 5,
        "isCorrect": true
    },
    {
        "timeTaken": 5,
        "isCorrect": true
    },
    {
        "timeTaken": 2,
        "isCorrect": true
    },
    {
        "timeTaken": 5,
        "isCorrect": true
    },
    {
        "timeTaken": 5,
        "isCorrect": true
    },
    {
        "timeTaken": 1,
        "isCorrect": true
    },
    {
        "timeTaken": 1,
        "isCorrect": true
    },
    {
        "timeTaken": 4,
        "isCorrect": true
    },
    {
        "timeTaken": 1,
        "isCorrect": true
    },
    {
        "timeTaken": 1,
        "isCorrect": true
    }
]


describe('Game Service Full', () => {

    let game1 = null;

    let savedUser = undefined;

    let gameWeek1 = '63c8e9dea08a3244b63e9d05';

    beforeEach(async () => {

        const newUser = {
            email: "orefash@gmail.com",
            password: "password",
            source: "local",
            username: "Orefash"
        }

        savedUser = await userService.addLocalUser(newUser);

    })


    describe('submitGame', () => {
        it('should return total points for all questions answered by user in live game', async () => {

            gameData = getGameData(category1, gameWeek1, savedUser._id);


            // console.log('Saved User: ', savedUser)


            // const gameCategory1 = { category: category1, description: 'PL game questions' }

            // await gameCategoryService.saveCategory(gameCategory1)


            const newGame = {
                ...gameData,
                answers: gameAnswers1,
                demo: false,
                today: gameWeekStub.valid0.startDate
            }

            const newGame1 = {
                ...gameData,
                answers: gameAnswers2,
                demo: false,
                today: gameWeekStub.valid0.startDate
            }
    

            let gameResponse = await gameService.submitGame(newGame);

            let mUser = await userService.getUserById(savedUser._id);

            let game = await gameService.getGameById(gameResponse.gameId);

            let gameResponse1 = await gameService.submitGame(newGame1);

            let mUser1 = await userService.getUserById(savedUser._id);

            let game1 = await gameService.getGameById(gameResponse1.gameId);

            let scores = await scoreService.getScores('1');

            console.log('socres: ', scores)

            expect(mUser.totalScore).toBe(4.9)
            expect(mUser.gamesPlayed).toBe(1)


            expect(game.score).toBe(4.9)
            expect(game.category).toBe(category1)

            expect(gameResponse.gameScore.totalScore).toBe(4.9)

            expect(gameResponse.submitLate).toBe(false)


            expect(gameResponse.reward_level).toBe(null)



            expect(gameResponse1.gameScore.totalScore).toBe(17)
            expect(Math.round(mUser1.totalScore * 10) / 10).toBe(21.9)
            expect(mUser1.gamesPlayed).toBe(2)
            expect(game1.score).toBe(17)
            expect(game1.category).toBe(category1)

        })

        it('should return total points for all questions answered by user in live game and show reward tier', async () => {

            gameData = getGameData(category1, gameWeek1, savedUser._id);



            const newGame = {
                ...gameData,
                answers: gameAnswers2,
                demo: false,
                today: gameWeekStub.valid0.startDate
            }

    

            let gameResponse = await gameService.submitGame(newGame);

            console.log('gr: ', gameResponse)

            let mUser = await userService.getUserById(savedUser._id);

            let game = await gameService.getGameById(gameResponse.gameId);

          
            expect(mUser.totalScore).toBe(17)
            expect(mUser.gamesPlayed).toBe(1)


            expect(game.score).toBe(17)
            expect(game.category).toBe(category1)

            expect(gameResponse.gameScore.totalScore).toBe(17)

            expect(gameResponse.submitLate).toBe(false)


            expect(gameResponse.reward_level).toBe('Tier 1')




        })

    })

})