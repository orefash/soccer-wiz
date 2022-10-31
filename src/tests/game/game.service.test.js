const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { Game } = require('../../game')
const GameService = require('../../game/game.service');


const getUserById = jest.fn();
when(getUserById).calledWith('low_bal_id').mockReturnValue({
    wallet_balance: 0
})
when(getUserById).calledWith('invalid_id').mockReturnValue(null)
when(getUserById).calledWith('5a1154523a6bcc1d245e143d').mockReturnValue({
    _id: '5a1154523a6bcc1d245e143d'
})//for valid user

const updateGameRecords = jest.fn();

let userService = {
    getUserById: getUserById,
    updateGameRecords: updateGameRecords
}

const gameService = GameService(Game, userService);


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


describe('Game Service', () => {

    describe('saveGame', () => {
        it('should save game details', async () => {

            const newGame = {
                category: 'General',
                player: '5a1154523a6bcc1d245e143d',
                score: 10,
                gameWeek: 2
            }

            let createdGame = await gameService.saveGame(newGame);

            expect(createdGame.score).toBe(10)
            expect(createdGame.gameWeek).toBe(2)
        })

    })

    describe('getGameById', () => {
        it('should get saved game details by id', async () => {

            const newGame = {
                category: 'General',
                player: '5a1154523a6bcc1d245e143d',
                score: 10,
                gameWeek: 2
            }

            let createdGame = await gameService.saveGame(newGame);

            let fetchedGame = await gameService.getGameById(createdGame._id)

            expect(fetchedGame.score).toBe(newGame.score)
            expect(fetchedGame.gameWeek).toBe(newGame.gameWeek)
        })

    })

    describe('getGames', () => {
        it('should return all game details', async () => {

            const newGame1 = {
                category: 'General',
                playerId: '5a1154523a6bcc1d245e143d',
                score: 10,
                gameWeek: 2
            }

            const newGame2 = {
                category: 'Premier League',
                playerId: '5a1154523a6bcc1d245e143d',
                score: 14,
                gameWeek: 2
            }

            let createdGame1 = await gameService.saveGame(newGame1);
            let createdGame2 = await gameService.saveGame(newGame2);

            let games = await gameService.getGames();

            expect(games.length).toBe(2)
        })

    })


    describe('getGameByWeekday', () => {
        it('should return all games in a specific weekday for a category', async () => {

            const newGame1 = {
                category: 'General',
                playerId: '5a1154523a6bcc1d245e143d',
                score: 10,
                gameWeek: 2
            }

            const newGame2 = {
                category: 'Premier League',
                playerId: '5a1154523a6bcc1d245e143d',
                score: 14,
                gameWeek: 2
            }

            const newGame3 = {
                category: 'Premier League',
                playerId: '5a1154523a6bcc1d245e143d',
                score: 12,
                gameWeek: 1
            }

            const newGame4 = {
                category: 'General',
                playerId: '5a1154523a6bcc1d245e143d',
                score: 9,
                gameWeek: 2
            }

            await gameService.saveGame(newGame1);
            await gameService.saveGame(newGame2);
            await gameService.saveGame(newGame3);
            await gameService.saveGame(newGame4);

            let generalGames = await gameService.getGameByWeekday('General', 2);
            let premierGames = await gameService.getGameByWeekday('Premier League', 2);

            expect(generalGames.length).toBe(2)
            expect(premierGames.length).toBe(1)
        })

    })

    describe('submitGame', () => {
        it('should return total points for all questions answered by user in demo game', async () => {

            const newGame = {
                category: 'General',
                playerId: '5a1154523a6bcc1d245e143d',
                username: 'john',
                answers: gameAnswers1,
                demo: true
            }

            let gameResponse = await gameService.submitGame(newGame);

            expect(gameResponse.gameScore).toBe(4.9)
        })

    })


    describe('submitGame', () => {
        it('should throw error when user is invalid', async () => {

            const newGame = {
                category: 'General',
                playerId: 'invalid_id',
                username: 'john',
                answers: gameAnswers1,
                demo: true
            }

            await expect( gameService.submitGame(newGame)).rejects.toThrow()
        })

    })



    describe('submitGame', () => {
        it('should return score for live game played; save game details if within match day ', async () => {

            const newGame = {
                gameWeek: 1,
                category: 'General',
                playerId: '5a1154523a6bcc1d245e143d',
                username: 'john',
                answers: gameAnswers1,
                demo: false,
                today: new Date('02/11/2022')
            }

            let gameResponse = await gameService.submitGame(newGame);

            let savedGame = await gameService.getGameById(gameResponse.gameId)

            
            expect(gameResponse.gameScore).toBe(4.9)
            expect(gameResponse.submitLate).toBe(false)
            expect(savedGame.score).toBe(gameResponse.gameScore)

        })

    })


    describe('submitGame', () => {
        it('should return score for live game played; indicate late submission in response if outside matchday', async () => {

            const newGame = {
                gameWeek: 1,
                category: 'General',
                playerId: '5a1154523a6bcc1d245e143d',
                username: 'john',
                answers: gameAnswers1,
                demo: false,
                today: new Date('30/10/2022')
            }

            let gameResponse = await gameService.submitGame(newGame);

            // let savedGame = await gameService.getGameById(gameResponse.gameId)

            
            expect(gameResponse.gameScore).toBe(4.9)
            expect(gameResponse.submitLate).toBe(true)
            expect(gameResponse.gameId).toBe(null)

        })

    })
    
})