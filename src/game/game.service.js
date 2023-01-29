"use strict";
const { checkTodayWithinMatchday } = require("../utils/timeValidations");

const { calcGameScore } = require("../utils/gameScores");
const { questionService } = require("../question");

const saveGame = (Game) => async ({ player, category, gameWeek, score }) => {

    const newGame = new Game({ player, category, gameWeek, score })

    return newGame.save()
}


const submitGame = (Game, userService, scoreService) => async ({ gameWeek, category, playerId, answers, demo, today = new Date() }) => {

    let user = await userService.getUserById(playerId);
    if (!user)
        throw new Error("User does not exist");

    const gScore = await calcGameScore(answers);

    // console.log('out gscore: ', gScore)

    let responseData = { gameScore: gScore, playerId, demo, gameId: null }

    if (!demo) {
        const inGameWeek = checkTodayWithinMatchday(today);

        if (inGameWeek) {
            // let score = gameScore.totalScore;
            // console.log('in gscore: ', gScore)


            const updatedUser = await userService.updateGameRecords({ id: playerId, score: gScore.totalScore })

            // console.log('updated user: game: ', updatedUser)

            const newGame = await saveGame(Game)({ player: playerId, category, gameWeek, score: gScore.totalScore })

            // console.log('updated user: game: ', newGame)

            const gameScore = await scoreService.saveScore({ score: gScore.totalScore, category, gameWeek, date: today, userId: playerId, username: user.username })

            // console.log('updated score: game: ', gameScore)

            responseData.gameId = newGame._id;
            responseData.submitLate = false
        } else {
            responseData.submitLate = true
        }

    }


    return responseData
}

const getGames = (Game) => async () => {
    const games = await Game.find();

    return games;
}

const getGameById = (Game) => async (id) => {

    const game = await Game.findById(id);

    return game;
}

const getGameByWeekday = (Game) => async (category, gameWeek) => {
    let games = null;

    games = await Game.find({ category: category, gameWeek: gameWeek });

    return games;
}



module.exports = (Game, userService, scoreService, questionService) => {
    return {
        submitGame: submitGame(Game, userService, scoreService),
        getGames: getGames(Game),
        getGameById: getGameById(Game),
        getGameByWeekday: getGameByWeekday(Game),
        saveGame: saveGame(Game)
    }
}