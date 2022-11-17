const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { Game, gameService } = require('../../game')
// const GameService = require('../../game/game.service');

const { User, userService } = require('../../user');

const { scoreService } = require('../../score')


// const getUserById = jest.fn();
// when(getUserById).calledWith('low_bal_id').mockReturnValue({
//     wallet_balance: 0
// })
// when(getUserById).calledWith('invalid_id').mockReturnValue(null)
// when(getUserById).calledWith('5a1154523a6bcc1d245e143d').mockReturnValue({
//     _id: '5a1154523a6bcc1d245e143d'
// })//for valid user

// const updateGameRecords = jest.fn();

// let userService = {
//     getUserById: getUserById,
//     updateGameRecords: updateGameRecords
// }

// const saveScore = jest.fn();

// let scoreService = {
//     saveScore: saveScore
// }

// const gameService = GameService(Game, userService, scoreService);


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


            const newGame = {
                gameWeek: 1,
                category: 'General',
                playerId: savedUser._id,
                username: 'john',
                answers: gameAnswers1,
                demo: false,
                today: new Date('02/11/2022')
            }

            const newGame1 = {
                gameWeek: 1,
                category: 'General',
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
            expect(game.category).toBe('General')

            expect(gameResponse.gameScore.totalScore).toBe(4.9)

            expect(gameResponse.submitLate).toBe(false)


            
            expect(gameResponse1.gameScore.totalScore).toBe(4.7)
            expect(Math.round(mUser1.totalScore * 10) / 10).toBe(9.6)
            expect(mUser1.gamesPlayed).toBe(2)
            expect(game1.score).toBe(4.7)
            expect(game1.category).toBe('General')

            // expect(savedGame.score).toBe(gameResponse.gameScore.totalScore)
        })

    })





    // describe('submitGame', () => {
    //     it('should return score for live game played; save game details if within match day ', async () => {

    //         const newGame = {
    //             gameWeek: 1,
    //             category: 'General',
    //             playerId: '5a1154523a6bcc1d245e143d',
    //             username: 'john',
    //             answers: gameAnswers1,
    //             demo: false,
    //             today: new Date('02/11/2022')
    //         }

    //         let gameResponse = await gameService.submitGame(newGame);

    //         let savedGame = await gameService.getGameById(gameResponse.gameId)

            
    //         expect(gameResponse.gameScore.totalScore).toBe(4.9)
    //         expect(gameResponse.submitLate).toBe(false)
    //         expect(savedGame.score).toBe(gameResponse.gameScore.totalScore)

    //     })

    // })


    // describe('submitGame', () => {
    //     it('should return score for live game played; indicate late submission in response if outside matchday', async () => {

    //         const newGame = {
    //             gameWeek: 1,
    //             category: 'General',
    //             playerId: '5a1154523a6bcc1d245e143d',
    //             username: 'john',
    //             answers: gameAnswers1,
    //             demo: false,
    //             today: new Date('30/10/2022')
    //         }

    //         let gameResponse = await gameService.submitGame(newGame);

    //         // let savedGame = await gameService.getGameById(gameResponse.gameId)

            
    //         expect(gameResponse.gameScore.totalScore).toBe(4.9)
    //         expect(gameResponse.submitLate).toBe(true)
    //         expect(gameResponse.gameId).toBe(null)

    //     })

    // })
    
})