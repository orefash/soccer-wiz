const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')


const { Question } = require('../../question')

const getUserById = jest.fn();
when(getUserById).calledWith('low_bal_id').mockReturnValue({
    wallet_balance: 0
})
when(getUserById).calledWith('invalid_id').mockReturnValue(null)
when(getUserById).calledWith('good_bal').mockReturnValue({
    wallet_balance: 100
})

let userService = {
    getUserById: getUserById
}

// const questionService = QuestionService(Question, userService);


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

    describe('getGameScore', () => {
        it('should return total points for all questions answered by user in demo game', async () => {

            const newGame = {
                category: 'General',
                player: 'valid_user_id',
                username: 'john',
                answers: gameAnswers1,
                demo: true
            }



            expect(true).toBe(true)
        })

    })
    
})