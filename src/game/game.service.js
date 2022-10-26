const checkTodayWithinMatchday = require("../utils/timeValidations");

const { calcGameScore } = require("../utils/gameScores")


const submitGame = (Game, userService) => async ({ username, category, playerId, answers, demo }) => {

    let user = await userService.getUserById(playerId);
    if (!user)
        throw new Error("User does not exist");

    
    


    
  

    return updatedQuestion
}



const getQuestionsForGame = (Question, userService) => async ({ userId, category, demo }, queryLimit = 0) => {

    let data = {
        user: userId, sufficient_balance: true, demo: demo, in_matchday: true, error: true
    };
    let questions = null;

    let user = await userService.getUserById(userId);

    if (!user)
        throw new Error("User does not exist");

    if (!demo && user.wallet_balance < 10) {
        data.sufficient_balance = false
        return data;
    }

    if (!demo && !checkTodayWithinMatchday()) {
        data.in_matchday = false
        return data;
    }

    if (queryLimit > 0)
        questions = await Question.aggregate([{ $match: { category: category } }, { $sample: { size: queryLimit } }]);
    else
        questions = await Question.aggregate([{ $match: { category: category } }, { $sample: { size: 12 } }]);
    
    data.error = false;
    data.questions = questions;

    return data;
}



module.exports = (Game, userService) => {
    return {

        

    }
}