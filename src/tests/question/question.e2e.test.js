const { when } = require('jest-when')

const { connect, clearDatabase, closeDatabase } = require('../db')
const Question = require('../../question/question.model')
const QuestionService = require('../../question/question.service');

const User = require('../../user/user.model');
const UserService = require('../../user/user.service');

const userService = UserService(User);

let gameWeekService = {};

const gameWeekStub = require('../stubs/gameWeek.stub');
const { questionData } = require('../stubs/question.stub');

let getGameById = jest.fn().mockReturnValue(gameWeekStub.valid);

gameWeekService.getGameById = getGameById;


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
when(getCategoryByName).calledWith(categoryInvalid).mockReturnValue(null);

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

});
// when(getCategoryByName).calledWith().mockReturnValue(null)


let gameSettingService = {
    getSettings: getSettings
}


const questionService = QuestionService(Question, userService, gameCategoryService, gameSettingService, gameWeekService);


beforeAll(async () => await connect())
afterEach(async () => await clearDatabase())
afterAll(async () => await closeDatabase())

describe('Question Service - E2E', () => {

    const gameWeekDemo = "63c8e9dea08a3244b63e9d05";
    const generalQuestion = questionData(gameWeekDemo, category1);

    describe('Question Service - getQuestionsForGame', () => {

        beforeEach(async () => {
    
            await questionService.addQuestion(generalQuestion);
            await questionService.addQuestion(generalQuestion);
            
        })

        it('valid user should be able to get Questions for live Game within match day period and user wallet balance is reduced', async () => {

            
    
            let original_wallet_balance = 30;
    
            
    
            const user = new User({
                email: 'test@mail.com', source: "local", username: 'orefash', wallet_balance: original_wallet_balance
            })
            let createdUser = await user.save();
    
            const userId = createdUser._id;
    
            const data = {
                category: category1,
                userId: userId,
                date: new Date('October 19, 2022 10:50:39 AM'),
                gameWeek: gameWeekDemo
            }
            // const limit = 1;
    
            const fetchedGame = await questionService.getQuestionsForGame(data);
            // console.log("in game: ", fetchedGame)
    
            expect(getGameById).toBeCalled();
            expect(fetchedGame.questions.length).toEqual(2);
            expect(fetchedGame.user).toEqual(userId);
            expect(fetchedGame.error).toEqual(false);
    
            let sameUser = await userService.getUserById(userId);
            console.log('user: ', createdUser);
            console.log('user - after: ', sameUser);

            
            expect(sameUser.wallet_balance).toEqual(original_wallet_balance-10);
    
    
        })

    });

    

    // describe('getGameWeekQuestionData', () => {
    //     it('should be able to get Question By Id', async () => {

    //         await gameWeekService.addGameWeek(gameWeekStub.valid)
    //         await gameWeekService.addGameWeek(gameWeekStub.valid2)

    //         await questionService.addQuestion(q3);
    //         await questionService.addQuestion(q3);
    //         await questionService.addQuestion(q3);
    //         let t1 = q3;
    //         t1.gameWeek = 2
    //         await questionService.addQuestion(t1);
    //         await questionService.addQuestion(t1);
    //         await questionService.addQuestion(q2);
    //         await questionService.addQuestion(q2);

    //         let data2 = await questionService.getGameWeekQuestionData(t1.category)

    //         expect(data2.length).toEqual(2);
    //         expect(data2[0].count).toEqual(3);



    //     })


    // })


})


