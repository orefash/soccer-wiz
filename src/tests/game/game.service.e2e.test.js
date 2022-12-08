const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { Game, gameService } = require('../../game')
const { gameCategoryService } = require('../../gameCategory')
// const GameService = require('../../game/game.service');

const { User, userService } = require('../../user');

// const { ScoreService, DailyScore, WeeklyScore, MonthlyScore, Score } = require('../../score')

// const getCategoryByName = jest.fn();
// when(getCategoryByName).calledWith('EFL').mockReturnValue(true)
// when(getCategoryByName).calledWith('PL').mockReturnValue(true)

// let gameCategoryService = {
//     getCategoryByName: getCategoryByName
// }

// const scoreService = ScoreService(DailyScore, WeeklyScore, MonthlyScore, Score, gameCategoryService);

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
        timeTaken: 9,
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


describe('Game Service Full', () => {




    describe('submitGame', () => {
        it('should return total points for all questions answered by user in live game', async () => {

            const newUser = {
                email: "orefash@gmail.com",
                password: "password",
                source: "local"
            }

            const savedUser = await userService.addLocalUser(newUser);

            // console.log('Saved User: ', savedUser)


            const gameCategory1 = { category: 'PL', description: 'PL game questions' }

            await gameCategoryService.saveCategory(gameCategory1)


            const newGame = {
                gameWeek: 1,
                category: 'PL',
                playerId: savedUser._id,
                username: 'john',
                answers: gameAnswers1,
                demo: false,
                today: new Date('02/11/2022')
            }

            const newGame1 = {
                gameWeek: 1,
                category: 'PL',
                playerId: savedUser._id,
                username: 'john',
                answers: gameAnswers2,
                demo: false,
                today: new Date('02/11/2022')
            }

            let gameResponse = await gameService.submitGame(newGame);

            let mUser = await userService.getUserById(savedUser._id);

            let game = await gameService.getGameById(gameResponse.gameId);

            let gameResponse1 = await gameService.submitGame(newGame1);

            let mUser1 = await userService.getUserById(savedUser._id);

            let game1 = await gameService.getGameById(gameResponse1.gameId);
            // console.log('game: ', gameResponse1)

            expect(mUser.totalScore).toBe(4.9)
            expect(mUser.gamesPlayed).toBe(1)


            expect(game.score).toBe(4.9)
            expect(game.category).toBe('PL')

            expect(gameResponse.gameScore.totalScore).toBe(4.9)

            expect(gameResponse.submitLate).toBe(false)



            expect(gameResponse1.gameScore.totalScore).toBe(4.7)
            expect(Math.round(mUser1.totalScore * 10) / 10).toBe(9.6)
            expect(mUser1.gamesPlayed).toBe(2)
            expect(game1.score).toBe(4.7)
            expect(game1.category).toBe('PL')

            // expect(savedGame.score).toBe(gameResponse.gameScore.totalScore)
        })

    })

})