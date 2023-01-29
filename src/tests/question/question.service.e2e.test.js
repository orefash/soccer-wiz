const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')
const Question = require('../../question/question.model')
const QuestionService = require('../../question/question.service');

const User = require('../../user/user.model');
const UserService = require('../../user/user.service');

const userService = UserService(User);

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

describe('Question Service - getQuestionsForGame', () => {

    it('valid user should be able to get Questions for live Game within match day period and user wallet balance is reduced)', async () => {

        const q1 = {

            "active": true,
            "points": 1,
            gameWeek: 1,
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
            gameWeek: 1,
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
            gameWeek: 1,
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

        let original_wallet_balance = 30;

        

        const user = new User({
            email: 'test@mail.com', firstName: 'Ore', lastName: 'Faseru', profilePhoto: 'photo', source: "google", username: 'orefash', wallet_balance: original_wallet_balance
        })
        let createdUser = await user.save();

        const userId = createdUser._id;

        const data = {
            category: 'General',
            demo: false,
            userId: userId,
            date: new Date('October 19, 2022 10:50:39 AM') //Wednesday
        }
        // const limit = 1;

        const fetchedGame = await questionService.getQuestionsForGame(data);
        // console.log("in game: ", fetchedGame)

        expect(fetchedGame.questions.length).toEqual(2);
        expect(fetchedGame.user).toEqual(userId);
        expect(fetchedGame.error).toEqual(false);

        let sameUser = await userService.getUserById(userId);
        
        
        expect(sameUser.wallet_balance).toEqual(original_wallet_balance-10);


    })


})


