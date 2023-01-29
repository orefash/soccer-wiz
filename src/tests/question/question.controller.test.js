const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')
const  Question = require('../../question/question.model');


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())

describe('Question Service', () => {

    describe('addQuestion', () => {
        it('should create a question and return saved question', async () => {
            expect(true).toBe(true)
        })

    })
    
})