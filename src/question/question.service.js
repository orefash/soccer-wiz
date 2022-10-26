const checkTodayWithinMatchday = require("../utils/timeValidations");

const addQuestion = (Question) => async (data) => {

    const existing = await Question.findOne({ question: data.question })

    // console.log("in create: ", existing)

    if(existing)
        throw new Error('Question already Exists')

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

const getQuestionsForGame = (Question, userService) => async ({ userId, category, demo, date }, queryLimit = 0) => {

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

    if (!demo && !checkTodayWithinMatchday(date)) {
        // console.log("In date check: ")
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

const getQuestionById = (Question) => async (id) => {

    const question = await Question.findById(id);

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