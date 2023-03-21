const { isValidTimePeriod } = require("../utils/timeValidations");

const { loadQuestionsFromGoogleSheets, formatDataForQuestionService } = require("../utils/loadQuestions");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const addQuestion = (Question, gameCategoryService, gameWeekService) => async (data) => {

    const { question, category, answers, gameWeek } = data;

    if (!question || !category || !answers || !gameWeek) {
        throw new Error("Incomplete Request details")
    }

    if (answers.length !== 4)
        throw new Error('Question requires 4 options')

    const isValidGameWeek = await gameWeekService.getGameById(gameWeek);

    if (!isValidGameWeek) throw new Error('Invalid GameWeek');

    const checkCategory = await gameCategoryService.getCategoryByName(data.category)

    if (!checkCategory && category !== 'demo') {
        console.log(`cat: ${checkCategory}, catg: ${category} `)
        throw new Error('Invalid Category');
    }


    const newQuestion = new Question(data)

    return newQuestion.save()
}

const addMultipleQuestions = (Question, gameCategoryService, gameWeekService) => async (data) => {

    const { questions, category, gameWeek } = data;

    if (!questions || !category || !gameWeek) {
        throw new Error("Incomplete Request details")
    };

    let gameWeekData = await gameWeekService.getGameById(data.gameWeek);

    if (!gameWeekData) throw new Error('Invalid game week');

    const checkCategory = await gameCategoryService.getCategoryByName(data.category)

    if (!checkCategory && category !== 'demo')
        throw new Error('Invalid Category')

    try {
        (data.questions).map(a => {
            a.category = data.category
            a.gameWeek = data.gameWeek
        })
        let insertedData = await Question.insertMany(data.questions);

        return { saved: true, questions: insertedData }
    } catch (error) {
        console.log("Error in data load: ", error.message)
        throw new Error(error.message)
    }
}

const addBulkQuestions = (Question, gameCategoryService, gameWeekService) => async (data) => {

    console.log("Data: ", data)

    if (!data.category || !data.spreadsheetId ) throw new Error('Incomplete parameters')
    let dataRange = "Sheet1!A:G";

    const category = await gameCategoryService.getCategoryByName(data.category);

    if (!category && data.category !== 'demo')
        throw new Error('Invalid Category');


    if(data.category !== 'demo'){
        const gameWeekData = await gameWeekService.getGameById(data.gameWeek);

        if(!gameWeekData)
            throw new Error('Invalid Gameweek');
    }

    try {
        let rawData = await loadQuestionsFromGoogleSheets(data.spreadsheetId, dataRange);

        // console.log("Fetched Q: ", rawData)



        let formattedData = await formatDataForQuestionService(rawData, data.category, data.gameWeek)

        // console.log("format Q: ", JSON.stringify(formattedData))
        console.log("format-Q: ", formattedData)

        let insertedData = await Question.insertMany(formattedData);

        // console.log("insert Q: ", insertedData)

        return insertedData;

    } catch (error) {
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


const getQuestions = (Question) => async (filterQuery = {}) => {
    const questions = await Question.find(filterQuery);

    return questions;
}

const getQuestionsByCategory = (Question, gameCategoryService) => async (category, queryLimit = 0) => {
    let questions = null;

    const questionCategory = await gameCategoryService.getCategoryByName(category)


    if (!questionCategory && category !== 'demo') {
        throw new Error('Invalid Category')
    }


    if (queryLimit > 0)
        questions = await Question.find({ category: category }).limit(queryLimit);
    else
        questions = await Question.find({ category: category });

    return questions;
}


const getQuestionsForGame = (Question, gameCategoryService, userService, gameSettingService, gameWeekService) => async ({ userId, category, date, gameWeek }) => {

    const settings = await gameSettingService.getSettings();

    if (!settings)
        throw new Error('Game Configuration not Set')

    let questionLimit = settings.questionPerQuiz;
    let questionDuration = settings.questionTimeLimit;
    let required_game_credits = settings.creditsPerGame;

    if (!questionLimit || questionLimit === 0 || !questionDuration || !required_game_credits)
        throw new Error('Game configuration not set')

    const questionCategory = await gameCategoryService.getCategoryByName(category)

    if (!questionCategory && category !== 'demo')
        throw new Error('Invalid Category')

    let demo = category === 'demo' ? true : false;

    let questionFilter = { category };

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

    if (!demo) {

        const gameWeekData = await gameWeekService.getGameById(gameWeek);

        if(!gameWeekData) return data;
        

        

        if (gameWeekData && gameWeekData.status === 'Live') {

            data.in_matchday = true;
            questionFilter = {
                "$and": [
                    { category: category },
                    { gameWeek: ObjectId(gameWeek) }
                ]
            }
        } else {
            return data;
        }
    }

    // console.log('filter: ', questionFilter);

    questions = await Question.aggregate([
        {
            $match: questionFilter
        },
        { $sample: { size: questionLimit } },
        {
            $project: {
                points: 1,
                category: 1,
                question: 1,
                answers: 1,
                timeLimit: { $literal: questionDuration }
            }
        }
    ]);

    if (!demo) {
        let updatedUser = await userService.updateWalletBalance({ id: userId, credits: -required_game_credits })

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


module.exports = (Question, userService, gameCategoryService, gameSettingService, gameWeekService) => {
    return {

        addQuestion: addQuestion(Question, gameCategoryService, gameWeekService),
        addMultipleQuestions: addMultipleQuestions(Question, gameCategoryService, gameWeekService),
        addBulkQuestions: addBulkQuestions(Question, gameCategoryService, gameWeekService),
        deleteQuestion: deleteQuestion(Question),
        deleteAllQuestions: deleteAllQuestions(Question),
        updateQuestion: updateQuestion(Question),
        getQuestionById: getQuestionById(Question),
        getQuestions: getQuestions(Question),
        getQuestionsByCategory: getQuestionsByCategory(Question, gameCategoryService),
        getQuestionsForGame: getQuestionsForGame(Question, gameCategoryService, userService, gameSettingService, gameWeekService)

    }
}