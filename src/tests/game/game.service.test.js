const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const Game = require('../../game/game.model');
const GameService = require('../../game/game.service');

let validUser = '5a1154523a6bcc1d245e143d';

const getUserById = jest.fn();
when(getUserById).calledWith('low_bal_id').mockReturnValue({
    wallet_balance: 0
})
when(getUserById).calledWith('invalid_id').mockReturnValue(null)
when(getUserById).calledWith(validUser).mockReturnValue({
    _id: validUser
})//for valid user

const updateGameRecords = jest.fn();

let userService = {
    getUserById: getUserById,
    updateGameRecords: updateGameRecords
}

const saveScore = jest.fn();

let scoreService = {
    saveScore: saveScore
};

const saveReward = jest.fn();

let rewardService = {
    saveReward: saveReward
};

const { valid0 } = require('../stubs/gameWeek.stub');

const GameWeek = require('../../gameWeek/gameWeek.model');

const gameService = GameService(Game, userService, scoreService, GameWeek, rewardService);


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

const getGameData = require('../stubs/game.stub');


describe('Game Service', () => {

let gameWeek1 = '63c8e9dea08a3244b63e9d05';
let gameWeek2 = '61c8e9dea08a3244b63e9d05';

let category1 = "General";
let demoCat = "demo";

let game1 = getGameData(category1, gameWeek1, validUser);
let game2 = getGameData(category1, gameWeek2, validUser);
let game3 = getGameData(category1, gameWeek1, validUser);

let demoGame = getGameData(demoCat, gameWeek1);

    describe('saveGame', () => {
        it('should save game details', async () => {


            let createdGame = await gameService.saveGame(game1);

            expect(createdGame.score).toBe(game1.score);
        })

    })

    describe('getGameById', () => {
        it('should get saved game details by id', async () => {

            let createdGame = await gameService.saveGame(game1);

            let fetchedGame = await gameService.getGameById(createdGame._id)

            expect(fetchedGame.score).toBe(game1.score);
        })

    })

    describe('getGames', () => {
        it('should return all game details', async () => {

           

            let createdGame1 = await gameService.saveGame(game1);
            let createdGame2 = await gameService.saveGame(game2);

            let games = await gameService.getGames();

            expect(games.length).toBe(2)
        })

    })


    describe('getGameByWeekday', () => {
        it('should return all games in a specific weekday for a category', async () => {

           

            await gameService.saveGame(game1);
            await gameService.saveGame(game2);
            await gameService.saveGame(game3);
            await gameService.saveGame(demoGame);

            let generalGames = await gameService.getGameByWeekday(category1, gameWeek1);

            expect(generalGames.length).toBe(2)
        })

    })

    describe('submitGame', () => {
        let gameWeekData = undefined;
        let validGame = undefined;
        beforeEach(async () => {
            
            gameWeekData = await new GameWeek(valid0).save();
            validGame = {
                ...game1,
                gameWeek: gameWeekData._id,
                answers: gameAnswers1,
                today: gameWeekData.startDate
            }
            // console.log('C G: ', gameWeekData);
            // console.log('V G: ', validGame);
        })

        it('should return total points for all questions answered by user in demo game', async () => {

            const newGame = {
                category: demoCat,
                player: '5a1154523a6bcc1d245e143d',
                answers: gameAnswers1,
            }

            let gameResponse = await gameService.submitGame(newGame);

            // console.log("Game response: ", gameResponse)
            // console.log("Game response: ", JSON.stringify(gameResponse, null, 4));

            expect(gameResponse.gameScore.totalScore).toBe(4.9)
            expect(gameResponse.gameScore.noOfCorrect).toBe(4)
            expect(gameResponse.gameScore.noOfQuestions).toBe(6)
        })

       
        it('should throw error when user is invalid', async () => {

            const newGame = {
                category: 'General',
                playerId: 'invalid_id',
                username: 'john',
                answers: gameAnswers1
            }

            await expect(gameService.submitGame(newGame)).rejects.toThrow()
        })


        it('should return score for live game played; indicate late submission in response if outside matchday', async () => {

            // console.log('invald chk: ')
            const newGame = {
                ...validGame,
                today: new Date('05/07/2022')
            }

            let gameResponse = await gameService.submitGame(newGame);

            // let savedGame = await gameService.getGameById(gameResponse.gameId)


            expect(gameResponse.gameScore.totalScore).toBe(4.9)
            expect(gameResponse.submitLate).toBe(true)
            expect(gameResponse.gameId).toBe(null)

        })

        it('should return score for live game played; save game details if within match day ', async () => {


            // console.log('in check: ');
            let games = await GameWeek.find();
            let gameResponse = await gameService.submitGame(validGame);

            // console.log('TResp: ', gameResponse);

            let savedGame = await gameService.getGameById(gameResponse.gameId)


            expect(gameResponse.gameScore.totalScore).toBe(4.9)
            expect(gameResponse.submitLate).toBe(false)
            expect(savedGame.score).toBe(gameResponse.gameScore.totalScore)
            expect(gameResponse.gameScore.noOfCorrect).toBe(4)
            expect(gameResponse.gameScore.noOfQuestions).toBe(6)

        })


    })

})