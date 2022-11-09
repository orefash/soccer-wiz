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

const questionService = QuestionService(Question, userService);


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())

describe('Question Service', () => {

    describe('addQuestion', () => {
        it('should create a question and return saved question', async () => {

            const newQuestion = {

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
                    }
                ]
            }

            const createdQuestion = await questionService.addQuestion(newQuestion);

            expect(createdQuestion.question).toEqual(newQuestion.question)
            // done();

        })

        it('should not create a question if it exists already', async () => {

            const newQuestion = {

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
                    }
                ]
            }

            const createdQuestion = await questionService.addQuestion(newQuestion);

            await expect(questionService.addQuestion(newQuestion)).rejects.toThrow()
            // done();

        })
    })

    describe('deleteQuestion', () => {
        it('should delete a question when given id', async () => {

            const newQuestion = {

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
                    }
                ]
            }

            const createdQuestion = await questionService.addQuestion(newQuestion);

            await questionService.deleteQuestion(createdQuestion._id)

            const checkQuestion = await questionService.getQuestionById(createdQuestion._id)


            expect(checkQuestion).toBeNull()
            // done();

        })
    })


    describe('updateQuestion', () => {
        it('should update a question and return the updated question', async () => {

            const newQuestion = {

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
                    }
                ]
            }

            const createdQuestion = await questionService.addQuestion(newQuestion);

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

            const newQuestion = {

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
                    }
                ]
            }

            const createdQuestion = await questionService.addQuestion(newQuestion);

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
                    }
                ]
            }

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const category = "General";

            const fetchedQuestions = await questionService.getQuestionsByCategory(category);

            expect(fetchedQuestions.length).toEqual(2);

            expect(fetchedQuestions[0].category).toEqual(category);


        })

        it('should be able to get n number of Questions By Category', async () => {

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
                    }
                ]
            }

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

            const q1 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have 2?",
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
                    }
                ]
            }


            const q2 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have 3?",
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
                    }
                ]
            }

            const q3 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have 4?",
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
                    }
                ]
            }

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const fetchedQuestions = await questionService.getQuestions();

            expect(fetchedQuestions.length).toEqual(3);

        })

        
    })


    describe('getQuestionsForGame', () => {
        it('valid user should be able to get Questions for demo Game', async () => {

            const q1 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have1?",
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
                    }
                ]
            }


            const q2 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have2?",
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
                    }
                ]
            }

            const q3 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have3?",
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
                    }
                ]
            }

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const userId = 'good_bal';
            const data = {
                category: 'General',
                demo: true,
                userId: userId
            }

            const fetchedGame = await questionService.getQuestionsForGame(data);
            // console.log("in game: ", fetchedGame)

            expect(fetchedGame.questions.length).toEqual(2);
            expect(fetchedGame.user).toEqual(userId);
            expect(fetchedGame.error).toEqual(false);


        })

        it('valid user should be able to get Questions for demo Game with limit', async () => {

            const q1 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have1?",
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
                    }
                ]
            }


            const q2 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have2?",
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
                    }
                ]
            }

            const q3 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have3?",
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
                    }
                ]
            }

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const userId = 'good_bal';
            const data = {
                category: 'General',
                demo: true,
                userId: userId
            }
            const limit = 1;

            const fetchedGame = await questionService.getQuestionsForGame(data, limit);
            // console.log("in game: ", fetchedGame)

            expect(fetchedGame.questions.length).toEqual(limit);
            expect(fetchedGame.user).toEqual(userId);
            expect(fetchedGame.error).toEqual(false);


        })

        it('invalid user should not be able to get Questions for Game', async () => {

            const q1 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have1?",
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
                    }
                ]
            }


            const q2 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have2?",
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
                    }
                ]
            }

            const q3 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have3?",
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
                    }
                ]
            }

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

            const q1 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have1?",
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
                    }
                ]
            }


            const q2 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have2?",
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
                    }
                ]
            }

            const q3 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have3?",
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
                    }
                ]
            }

            await questionService.addQuestion(q1);
            await questionService.addQuestion(q2);
            await questionService.addQuestion(q3);

            const userId = 'low_bal_id';
            
            const data = {
                category: 'General',
                demo: false,
                userId: userId
            }


            const fetchedGame = await questionService.getQuestionsForGame(data);
            
            expect(fetchedGame.user).toEqual(userId);
            expect(fetchedGame.error).toEqual(true);
            expect(fetchedGame.sufficient_balance).toEqual(false);


        })


        it('valid user with sufficient balance should not be able to get Questions for live Game outside matchday period - (Tuesday 9am - Friday 11.59pm)', async () => {

            const q1 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have1?",
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
                    }
                ]
            }


            const q2 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have2?",
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
                    }
                ]
            }

            const q3 = {

                "active": true,
                "points": 1,
                "question": "How many Ballon'Dor does Messi have3?",
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
                    }
                ]
            }

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