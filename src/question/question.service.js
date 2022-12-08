const checkTodayWithinMatchday = require("../utils/timeValidations");

const { loadQuestionsFromGoogleSheets, formatDataForQuestionService } = require("../utils/loadQuestions");

const addQuestion = (Question, gameCategoryService) => async (data) => {

    if (data.answers.length !== 4)
        throw new Error('Question requires 4 options')

    const existing = await Question.findOne({ question: data.question })

    // console.log("in create: ", existing)

    if (existing)
        throw new Error('Question already Exists')

    const category = await gameCategoryService.getCategoryByName(data.category)

    if (!category && data.category !== 'demo')
        throw new Error('Invalid Category')

    const newQuestion = new Question(data)

    return newQuestion.save()
}

const addBulkQuestions = (Question, gameCategoryService) => async (data) => {

    // if (data.answers.length !== 4)
    //     throw new Error('Question requires 4 options')
    if(!data.category || !data.spreadsheetId) throw new Error('Incomplete parameters')
    let dataRange = "Sheet1!A:F";

    const category = await gameCategoryService.getCategoryByName(data.category)

    // console.log("dat: ", data.category)
    // console.log("cat: ", category)

    if (!category && data.category !== 'demo')
        throw new Error('Invalid Category')

    try{

        let rawData = await loadQuestionsFromGoogleSheets(data.spreadsheetId, dataRange);

        // console.log("Fetched Q: ", rawData)

        let formattedData = await formatDataForQuestionService(rawData, data.category)

        // console.log("format Q: ", JSON.stringify(formattedData))

        let insertedData = await Question.insertMany(formattedData);

        // console.log("insert Q: ", insertedData)

        return insertedData

    }catch(error){
        console.log("Error in data load: ", error.message)
        throw new Error(error.message)
    }

    


}


const deleteQuestion = (Question) => async (id) => {
    const question = await Question.findByIdAndDelete(id)

    return question;
}


const deleteAllQuestions = (Question) => async () => {
    const question = await Question.deleteMany({});

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

const getQuestionsByCategory = (Question, gameCategoryService) => async (category, queryLimit = 0) => {
    let questions = null;

    const questionCategory = await gameCategoryService.getCategoryByName(category)

    
    if (!questionCategory && category !== 'demo')
        throw new Error('Invalid Category')

    if (queryLimit > 0)
        questions = await Question.find({ category: category }).limit(queryLimit);
    else
        questions = await Question.find({ category: category });

    return questions;
}

const getQuestionsForGame = (Question, gameCategoryService, userService, gameSettingService) => async ({ userId, category, demo, date }) => {

    let required_game_credits = 10;

    if (demo && category !== 'demo' ) {
        throw Error("Demo field not set")
    }

    if (!demo && category === 'demo' ) {
        throw Error("Invalid category for Live game")
    }

    const questionCategory = await gameCategoryService.getCategoryByName(category)
    
    if (!questionCategory && category !== 'demo')
        throw new Error('Invalid Category')

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
        addBulkQuestions: addBulkQuestions(Question, gameCategoryService),
        deleteQuestion: deleteQuestion(Question),
        deleteAllQuestions: deleteAllQuestions(Question),
        updateQuestion: updateQuestion(Question),
        getQuestionById: getQuestionById(Question),
        getQuestions: getQuestions(Question),
        getQuestionsByCategory: getQuestionsByCategory(Question, gameCategoryService),
        getQuestionsForGame: getQuestionsForGame(Question, gameCategoryService, userService, gameSettingService)

    }
}