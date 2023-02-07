require("dotenv").config();

const { when } = require('jest-when');

const { connect, clearDatabase, closeDatabase } = require('../db');
const Question = require('../../question/question.model');
const QuestionService = require('../../question/question.service');


const gameWeekStub = require('../stubs/gameWeek.stub');
const { questionData } = require('../stubs/question.stub');


let gameWeekService = {};
let getGameById = jest.fn().mockReturnValue(gameWeekStub.valid);

gameWeekService.getGameById = getGameById;


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

const category1 = "General";
const category2 = "Italy";
const categoryInvalid = 'invalid';

const getCategoryByName = jest.fn();
when(getCategoryByName).calledWith(category1).mockReturnValue({
    category: category1
})
when(getCategoryByName).calledWith(category2).mockReturnValue({
    category: category2
})
when(getCategoryByName).calledWith(categoryInvalid).mockReturnValue(null)


let gameCategoryService = {
    getCategoryByName: getCategoryByName
}

const getSettings = jest.fn();
when(getSettings).calledWith().mockReturnValue({

    creditBuyList: [
        10, 20, 50, 100
    ],
    currentGameWeek: 3,
    costPerCredit: 30,
    creditsPerGame: 10,
    minPointsForReward: 12,
    questionTimeLimit: 12,
    questionPerQuiz: 15
})


let gameSettingService = {
    getSettings: getSettings
}


const questionService = QuestionService(Question, userService, gameCategoryService, gameSettingService, gameWeekService);


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())




describe('Question Service', () => {

    const gameWeekDemo = "63c8e9dea08a3244b63e9d05";
    const invalidQuestionC = questionData(gameWeekDemo, categoryInvalid);
    const invalidAnswers = questionData(gameWeekDemo, category1, false);
    const generalQuestion = questionData(gameWeekDemo, category1);
    const italyQuestion = questionData(gameWeekDemo, category2);
    const demoQuestion = questionData(gameWeekDemo, 'demo');


    describe('addQuestion', () => {
        it('should create a question and return saved question', async () => {
            const createdQuestion = await questionService.addQuestion(generalQuestion);

            expect(createdQuestion.question).toEqual(generalQuestion.question)
        })

        it('should throw error when answers are not 4', async () => {
            await expect(questionService.addQuestion(invalidAnswers)).rejects.toThrow()
        })


        it('should throw an error if category is invalid', async () => {
            await expect(questionService.addQuestion(invalidQuestionC)).rejects.toThrow();
        })
    })

    describe('addMultipleQuestions', () => {

        const data = {
            category: category1,
            gameWeek: gameWeekDemo,
            questions: [
                generalQuestion, generalQuestion, italyQuestion
            ]
        }

        it('should save multiple questions', async () => {

            const createdQuestion = await questionService.addMultipleQuestions(data);

            expect(createdQuestion.saved).toBeTruthy();
            expect(createdQuestion.questions.length).toEqual(data.questions.length)

        })

        it('should throw error if gameweek not set', async () => {

            gameWeekService.getGameById.mockImplementationOnce(() => {
                throw new Error();
            });

            await expect(questionService.addMultipleQuestions(data)).rejects.toThrow();

            expect(gameWeekService.getGameById).toBeCalled();

        })

    })

    describe('addBulkQuestions', () => {
        it('should save multiple questions at a time - from google sheets', async () => {

            let data = {
                category: 'General',
                spreadsheetId: '1UF0iskvv8mfenwV8_FOwF5JYB13O2fIAsJ9oU3xBLVQ',

            }

            const bulkQuestions = await questionService.addBulkQuestions(data);

            const fetchedQuestions = await questionService.getQuestionsByCategory(data.category);

            expect(fetchedQuestions.length).toEqual(30);

            expect(bulkQuestions.length).toEqual(30)
            // done();

        })
        it('should save multiple demo questions at a time - from google sheets', async () => {

            let data = {
                category: 'demo',
                spreadsheetId: '1UF0iskvv8mfenwV8_FOwF5JYB13O2fIAsJ9oU3xBLVQ',

            }

            const bulkQuestions = await questionService.addBulkQuestions(data);

            const fetchedQuestions = await questionService.getQuestionsByCategory(data.category);

            expect(fetchedQuestions.length).toEqual(30);

            expect(bulkQuestions.length).toEqual(30)
            // done();

        })

        it('should throw error when invalid catgeory is set', async () => {

            let data = {
                category: 'invalid',
                spreadsheetId: '1UF0iskvv8mfenwV8_FOwF5JYB13O2fIAsJ9oU3xBLVQ',

            }

            // const bulkQuestions = await questionService.addBulkQuestions(data);

            await expect(questionService.addBulkQuestions(data)).rejects.toThrow()

            // done();

        })
    })



    describe('deleteQuestion', () => {
        it('should delete a question when given id', async () => {

            const createdQuestion = await questionService.addQuestion(generalQuestion);

            await questionService.deleteQuestion(createdQuestion._id)

            const checkQuestion = await questionService.getQuestionById(createdQuestion._id)


            expect(checkQuestion).toBeNull()

        })
    })

    describe('deleteAllQuestions', () => {
        it('should delete all questions', async () => {

            await questionService.addQuestion(generalQuestion);

            const fetchedQuestions = await questionService.getQuestions();
            await questionService.deleteAllQuestions();
            const fetchedQuestions2 = await questionService.getQuestions();

            expect(fetchedQuestions.length).toEqual(1);
            expect(fetchedQuestions2.length).toEqual(0);

        })
    })


    describe('updateQuestion', () => {
        it('should update a question and return the updated question', async () => {



            const createdQuestion = await questionService.addQuestion(generalQuestion);

            const updateQuestion = {

                "active": false,
                "question": "How many Ballon'Dor does Messi have today?",
                "answers": [
                    {
                        "optionNumber": 1,
                        "answerText": "6",
                        "isCorrect": false
                    },
                    {
                        "optionNumber": 2,
                        "answerText": "7",
                        "isCorrect": true
                    },
                    {
                        "optionNumber": 3,
                        "answerText": "2",
                        "isCorrect": false
                    }
                ]
            };

            const updatedQuestion = await questionService.updateQuestion(createdQuestion._id, updateQuestion);

            expect(updateQuestion.question).toEqual(updatedQuestion.question)
            expect(createdQuestion.question).not.toEqual(updatedQuestion.question)

            expect(updateQuestion.active).toEqual(updatedQuestion.active)
            // expect(updateQuestion.answers).toEqual(updatedQuestion.answers)

        })
    })

    describe('getQuestionById', () => {
        it('should be able to get Question By Id', async () => {

            const createdQuestion = await questionService.addQuestion(generalQuestion);

            const fetchedQuestion = await questionService.getQuestionById(createdQuestion._id);

            expect(fetchedQuestion.question).toEqual(createdQuestion.question);

            expect(fetchedQuestion.category).toEqual(createdQuestion.category);

        })

        it('should be able to return null in get Question By Id when id does not exist', async () => {

            const fetchedQuestion = await questionService.getQuestionById("qwertyuiokjh");

            expect(fetchedQuestion).toBeNull();

        })
    })



    


    describe('getQuestionsByCategory', () => {
        beforeEach(async () => {
            await questionService.addQuestion(generalQuestion);
            await questionService.addQuestion(demoQuestion);
        })

        it('should be able to get Question By Category', async () => {

            const fetchedQuestions = await questionService.getQuestionsByCategory(category1);

            expect(fetchedQuestions.length).toEqual(1);

            expect(fetchedQuestions[0].category).toEqual(category1);

        })

        it('should be able to get Question By demo Category', async () => {

            const category = "demo";

            const fetchedQuestions = await questionService.getQuestionsByCategory(category);

            expect(fetchedQuestions.length).toEqual(1);

            expect(fetchedQuestions[0].category).toEqual(category);

        })

        it('should throw error when categroy is invalid', async () => {
            const category = categoryInvalid;


            await expect(questionService.getQuestionsByCategory(category)).rejects.toThrow();

        })

        it('should throw error when categroy is invalid', async () => {

            const category = "";

            await expect(questionService.getQuestionsByCategory(category)).rejects.toThrow();

        })

        it('should be able to get n number of Questions By Category', async () => {

            const category = category1;
            const limit = 1;

            const fetchedQuestions = await questionService.getQuestionsByCategory(category, limit);

            expect(fetchedQuestions.length).toEqual(1);

            expect(fetchedQuestions[0].category).toEqual(category);


        })

    })


    describe('getAllQuestions', () => {


        beforeEach(async () => {
            await questionService.addQuestion(generalQuestion);
            await questionService.addQuestion(demoQuestion);
        });

        it('should be able to get All Saved Questions', async () => {

            const fetchedQuestions = await questionService.getQuestions();

            expect(fetchedQuestions.length).toEqual(2);

        })

        it('should be able to get questions by category', async () => {

            let filter = {}
            filter.category = category1;

            const fetchedQuestions = await questionService.getQuestions(filter);

            expect(fetchedQuestions.length).toEqual(1);

        })

        it('should be able to get questions by gameWeek', async () => {

            let filter = {}
            filter.gameWeek = gameWeekDemo;

            const fetchedQuestions = await questionService.getQuestions(filter);

            expect(fetchedQuestions.length).toEqual(2);

        })


    })


    describe('getQuestionsForGame', () => {

       

        beforeEach(async () => {
            await questionService.addQuestion(generalQuestion);
            await questionService.addQuestion(demoQuestion);
        })


        it('valid user should be able to get Questions for demo Game', async () => {

            const userId = 'good_bal';
            const data = {
                category: 'demo',
                userId: userId
            }

            const fetchedGame = await questionService.getQuestionsForGame(data);
            // console.log("in game: ", fetchedGame)

            expect(fetchedGame.questions.length).toEqual(1);
            expect(fetchedGame.user).toEqual(userId);
            expect(fetchedGame.error).toEqual(false);
        })

        it('should throw error with invlaid category', async () => {

            const userId = 'good_bal';
            const data = {
                category: '',
                userId: userId
            }


            await expect(questionService.getQuestionsForGame(data)).rejects.toThrow();
        })


        it('invalid user should not be able to get Questions for Game', async () => {

            const userId = 'invalid_id';

            const data = {
                category: category1,
                userId: userId
            }

            await expect(questionService.getQuestionsForGame(data)).rejects.toThrow();
        })

        it('user with insufficient balance should not be able to get Questions for live Game', async () => {


            const userId = 'low_bal_id';

            const data = {
                category: category1,
                userId: userId,
                date: new Date('October 17, 2022 10:50:39 AM')
            }

            const fetchedGame = await questionService.getQuestionsForGame(data);

            expect(fetchedGame.user).toEqual(userId);
            expect(fetchedGame.error).toEqual(true);
            expect(fetchedGame.in_matchday).toEqual(false);
            expect(fetchedGame.sufficient_balance).toEqual(false);


        })



    })




})