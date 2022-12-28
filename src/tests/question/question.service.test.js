require("dotenv").config()

const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')
const { Question } = require('../../question')
const QuestionService = require('../../question/question.service');

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

const getCategoryByName = jest.fn();
when(getCategoryByName).calledWith('General').mockReturnValue({
    category: 'General'
})
when(getCategoryByName).calledWith('Italy').mockReturnValue({
    category: 'Italy'
})
when(getCategoryByName).calledWith('invalid').mockReturnValue(null)


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
// when(getCategoryByName).calledWith().mockReturnValue(null)


let gameSettingService = {
    getSettings: getSettings
}


const questionService = QuestionService(Question, userService, gameCategoryService, gameSettingService);


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())


const q0 = {

    "active": true,
    "points": 1,
    "question": "How many Ballon'Dor does Messi have?",
    "category": "General",
    "answers": [
        {
            "optionNumber": 1,
            "answerText": "5",
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
        },
    ]
}

const q1 = {

    "active": true,
    "points": 1,
    "question": "How many Ballon'Dor does Messi have?",
    "category": "General",
    "answers": [
        {
            "optionNumber": 1,
            "answerText": "5",
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
        },
        {
            "optionNumber": 3,
            "answerText": "2",
            "isCorrect": false
        }
    ]
}


const q2 = {

    "active": true,
    "points": 1,
    "question": "How many Ballon'Dor does Messi have 2?",
    "category": "Italy",
    "answers": [
        {
            "optionNumber": 1,
            "answerText": "5",
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
        },
        {
            "optionNumber": 3,
            "answerText": "2",
            "isCorrect": false
        }
    ]
}

const q3 = {

    "active": true,
    "points": 1,
    "question": "How many Ballon'Dor does Messi have 3?",
    "category": "General",
    "answers": [
        {
            "optionNumber": 1,
            "answerText": "5",
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
        },
        {
            "optionNumber": 3,
            "answerText": "2",
            "isCorrect": false
        }
    ]
}

const q4 = {

    "active": true,
    "points": 1,
    "question": "How many Ballon'Dor does Messi have 3?",
    "category": "invalid",
    "answers": [
        {
            "optionNumber": 1,
            "answerText": "5",
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
        },
        {
            "optionNumber": 3,
            "answerText": "2",
            "isCorrect": false
        }
    ]
}


const q5 = {

    "active": true,
    "points": 1,
    "question": "How many Ballon'Dor does Messi havee 3?",
    "category": "demo",
    "answers": [
        {
            "optionNumber": 1,
            "answerText": "5",
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
        },
        {
            "optionNumber": 3,
            "answerText": "2",
            "isCorrect": false
        }
    ]
}


describe('Question Service', () => {

    describe('addQuestion', () => {
        it('should create a question and return saved question', async () => {


            const createdQuestion = await questionService.addQuestion(q1);

            expect(createdQuestion.question).toEqual(q1.question)
            // done();

        })
        it('should not create a question if it exists already', async () => {
       
            const createdQuestion = await questionService.addQuestion(q1);
            await expect(questionService.addQuestion(q1)).rejects.toThrow()
            // done();
        })

        it('should throw error when answers are not 4', async () => {
            await expect(questionService.addQuestion(q0)).rejects.toThrow()
        })


        it('should throw an error if category is invalid', async () => {

           
            // const createdQuestion = await questionService.addQuestion(q4);

            await expect(questionService.addQuestion(q4)).rejects.toThrow()
            // done();

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

            const createdQuestion = await questionService.addQuestion(q1);

            await questionService.deleteQuestion(createdQuestion._id)

            const checkQuestion = await questionService.getQuestionById(createdQuestion._id)


            expect(checkQuestion).toBeNull()

        })
    })

    describe('deleteAllQuestions', () => {
        it('should delete all questions', async () => {

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const fetchedQuestions = await questionService.getQuestions();
            await questionService.deleteAllQuestions();
            const fetchedQuestions2 = await questionService.getQuestions();

            expect(fetchedQuestions.length).toEqual(3);
            expect(fetchedQuestions2.length).toEqual(0);

        })
    })


    describe('updateQuestion', () => {
        it('should update a question and return the updated question', async () => {

            

            const createdQuestion = await questionService.addQuestion(q2);

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

            

            const createdQuestion = await questionService.addQuestion(q3);

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
        it('should be able to get Question By Category', async () => {

            

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const category = "General";

            const fetchedQuestions = await questionService.getQuestionsByCategory(category);

            expect(fetchedQuestions.length).toEqual(2);

            expect(fetchedQuestions[0].category).toEqual(category);


        })

        it('should be able to get Question By demo Category', async () => {

            

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);
            await questionService.addQuestion(q5);

            const category = "demo";

            const fetchedQuestions = await questionService.getQuestionsByCategory(category);

            expect(fetchedQuestions.length).toEqual(1);

            expect(fetchedQuestions[0].category).toEqual(category);


        })

        it('should throw error when categroy is invalid', async () => {
            
            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);
            await questionService.addQuestion(q5);

            const category = "invalid";


            await expect(questionService.getQuestionsByCategory(category)).rejects.toThrow();


        })

        it('should throw error when categroy is invalid', async () => {
            
            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);
            await questionService.addQuestion(q5);

            const category = "";

            await expect(questionService.getQuestionsByCategory(category)).rejects.toThrow();

        })

        it('should be able to get n number of Questions By Category', async () => {

            
            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const category = "General";
            const limit = 1;

            const fetchedQuestions = await questionService.getQuestionsByCategory(category, limit);

            expect(fetchedQuestions.length).toEqual(1);

            expect(fetchedQuestions[0].category).toEqual(category);


        })

    })


    describe('getAllQuestions', () => {
        it('should be able to get All Saved Questions', async () => {

            

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const fetchedQuestions = await questionService.getQuestions();

            expect(fetchedQuestions.length).toEqual(3);

        })

        
    })


    describe('getQuestionsForGame', () => {
        it('valid user should be able to get Questions for demo Game', async () => {

            

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);
            await questionService.addQuestion(q5);

            const userId = 'good_bal';
            const data = {
                category: 'demo',
                demo: true,
                userId: userId
            }

            const fetchedGame = await questionService.getQuestionsForGame(data);
            // console.log("in game: ", fetchedGame)

            expect(fetchedGame.questions.length).toEqual(1);
            expect(fetchedGame.user).toEqual(userId);
            expect(fetchedGame.error).toEqual(false);


        })

        it('should throw error with invlaid category', async () => {

            

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);
            await questionService.addQuestion(q5);

            const userId = 'good_bal';
            const data = {
                category: '',
                demo: true,
                userId: userId
            }

            // const fetchedGame = await questionService.getQuestionsForGame(data);
            // console.log("in game: ", fetchedGame)

            await expect(questionService.getQuestionsForGame(data)).rejects.toThrow();


        })

        
        it('invalid user should not be able to get Questions for Game', async () => {

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const userId = 'invalid_id';
            
            const data = {
                category: 'General',
                demo: true,
                userId: userId
            }

            await expect( questionService.getQuestionsForGame(data)).rejects.toThrow();


        })

        it('user with insufficient balance should not be able to get Questions for live Game', async () => { 

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const userId = 'good_bal';
            
            const data = {
                category: 'General',
                demo: false,
                userId: userId,
                date: new Date('October 17, 2022 10:50:39 AM')
            }


            const fetchedGame = await questionService.getQuestionsForGame(data);
            
            expect(fetchedGame.user).toEqual(userId);
            expect(fetchedGame.error).toEqual(true);
            expect(fetchedGame.in_matchday).toEqual(false);
            expect(fetchedGame.sufficient_balance).toEqual(true);


        })



    })




})