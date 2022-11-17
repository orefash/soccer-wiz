const checkTodayWithinMatchday = require("../utils/timeValidations");

const addQuestion = (Question, gameCategoryService) => async (data) => {

    if (data.answers.length !== 4)
        throw new Error('Question requires 4 options')

    const existing = await Question.findOne({ question: data.question })

    // console.log("in create: ", existing)

    if (existing)
        throw new Error('Question already Exists')

    const category = await gameCategoryService.getCategoryByName(data.category)

    if (!category)
        throw new Error('Invalid Category')


    const newQuestion = new Question(data)

    return newQuestion.save()
}

const deleteQuestion = (Question) => async (id) => {
    const question = await Question.findByIdAndDelete(id)

    return question;
}


const updateQuestion = (Question) => async (id, { question, active, answers }) => {

    const updatedQuestion = await Question.findByIdAndUpdate(id, { question, active, answers }, {
        new: true,
    });

    return updatedQuestion
}


const getQuestions = (Question) => async () => {
    const questions = await Question.find();

    return questions;
}

const getQuestionsByCategory = (Question) => async (category, queryLimit = 0) => {
    let questions = null;

    if (queryLimit > 0)
        questions = await Question.find({ category: category }).limit(queryLimit);
    else
        questions = await Question.find({ category: category });

    return questions;
}

const getQuestionsForGame = (Question, userService, gameSettingService) => async ({ userId, category, demo, date }) => {

    let required_game_credits = 10;

    let data = {
        user: userId, sufficient_balance: true, demo: demo, in_matchday: false, error: true
    };
    let questions = null;

    let user = await userService.getUserById(userId);

    if (!user)
        throw new Error("User does not exist");

    if (!demo && user.wallet_balance < required_game_credits) {
        data.sufficient_balance = false
        return data;
    }

    if (!demo && !checkTodayWithinMatchday(date)) {
        // console.log("In date check: ")
        data.in_matchday = false
        return data;
    }

    const settings = await gameSettingService.getSettings();

    if (!settings)
        throw new Error('Game Configuration not Set')

    let questionLimit = settings.questionPerQuiz

    if (!questionLimit || questionLimit === 0)
        throw new Error('Question Limit not set in configuration')

    // if (queryLimit > 0)
    //     questions = await Question.aggregate([{ $match: { category: category } }, { $sample: { size: queryLimit } }]);
    // else
    questions = await Question.aggregate([{ $match: { category: category } }, { $sample: { size: questionLimit } }]);

    if (!demo) {
        let updatedUser = await userService.updateWalletBalance({ id: userId, credits: -required_game_credits })
        data.in_matchday = true
    }

    data.error = false;
    data.questions = questions;
    data.questionLimit = questionLimit;

    return data;
}

const getQuestionById = (Question) => async (id) => {

    const question = await Question.findById(id);

    return question;
}


module.exports = (Question, userService, gameCategoryService, gameSettingService) => {
    return {

        addQuestion: addQuestion(Question, gameCategoryService),
        deleteQuestion: deleteQuestion(Question),
        updateQuestion: updateQuestion(Question),
        getQuestionById: getQuestionById(Question),
        getQuestions: getQuestions(Question),
        getQuestionsByCategory: getQuestionsByCategory(Question),
        getQuestionsForGame: getQuestionsForGame(Question, userService, gameSettingService)

    }
}