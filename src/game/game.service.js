"use strict";
const { isValidTimePeriod } = require("../utils/timeValidations");

const { calcGameScore } = require("../utils/gameScores");

const saveGame = (Game) => async ({ player, category, gameWeek, score }) => {

    const newGame = new Game({ player, category, gameWeek, score })

    return newGame.save()
}


const submitGame = (Game, userService, scoreService, GameWeek, rewardService) => async ({ gameWeek, category, player, answers, today = new Date() }) => {

    let user = await userService.getUserById(player);
    if (!user)
        throw new Error("User does not exist");

    const gScore = calcGameScore(answers);

    let demo = category === 'demo' ? true : false;

   
    let responseData = { gameScore: gScore, player, demo, gameId: null }

    if(demo) return responseData;


    let gameWeekData = await GameWeek.findOne({ _id: gameWeek });

    // let isValidDateCHeck1 = isValidTimePeriod({
    //     startDate: gameWeekData.startDate, 
    //     endDate: today
    // });
    // let isValidDateCHeck2 = isValidTimePeriod({
    //     startDate: today, endDate: gameWeekData.endDate
    // });


    // console.log(`CHecks d1: ${isValidDateCHeck1}  -  -  d2: ${isValidDateCHeck2}  -  -  `)


    if (!demo && gameWeekData && gameWeekData.status === 'Live' ) {

        // console.log('date check valid ')
        const updatedUser = await userService.updateGameRecords({ id: player, score: gScore.totalScore })

        // console.log('updated user: game: ', updatedUser)

        const newGame = await saveGame(Game)({ player: player, category, gameWeek, score: gScore.totalScore })

        // console.log('updated user: game: ', newGame)

        const gameScore = await scoreService.saveScore({ score: gScore.totalScore, category, gameWeek, date: today, userId: player, username: user.username })

        const rewards = await rewardService.saveReward({score: gScore.totalScore, userId: player, gameWeek})
        console.log('updated score: game: ', gameScore)

        if(rewards){
            responseData.reward_level = 'Tier '+rewards.tier
        }else{
            responseData.reward_level = null;
        }

        responseData.gameId = newGame._id;
        responseData.submitLate = false

    } else {
        // throw new Error('Invalid GameWeek Time');
        responseData.submitLate = true
    }



    return responseData;
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



module.exports = (Game, userService, scoreService, GameWeek, rewardService) => {
    return {
        submitGame: submitGame(Game, userService, scoreService, GameWeek, rewardService),
        getGames: getGames(Game),
        getGameById: getGameById(Game),
        getGameByWeekday: getGameByWeekday(Game),
        saveGame: saveGame(Game)
    }
}