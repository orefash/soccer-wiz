const checkTodayWithinMatchday = require("../utils/timeValidations");

const addQuestion = (Question) => (data) => {
    const newQuestion = new Question(data)

    return newQuestion.save()
}

const deleteQuestion = (Question) => (id) => {
    const question = Question.findByIdAndDelete(id)

    return question;
}


const updateQuestion = (Question) => (id, { question, category, answers }) => {

    const updatedQuestion = Question.findByIdAndUpdate(id, { question, category, answers }, {
        new: true,
    });

    return updatedQuestion
}


const getQuestions = (Question) => () => {
    const questions = Question.find();

    return questions;
}

const getQuestionsByCategory = (Question) => (category, queryLimit = 0) => {
    let questions = null;

    if (queryLimit > 0)
        questions = Question.find({ category: category }).limit(queryLimit);
    else
        questions = Question.find({ category: category });

    return questions;
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
    // data.sufficient_balance = true;
    data.questions = questions;

    return data;
}

const getQuestionById = (Question) => (id) => {

    const question = Question.findById(id);

    return question;
}


module.exports = (Question, userService) => {
    return {

        addQuestion: addQuestion(Question),
        deleteQuestion: deleteQuestion(Question),
        updateQuestion: updateQuestion(Question),
        getQuestionById: getQuestionById(Question),
        getQuestions: getQuestions(Question),
        getQuestionsByCategory: getQuestionsByCategory(Question),
        getQuestionsForGame: getQuestionsForGame(Question, userService)

    }
}