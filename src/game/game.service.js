const checkTodayWithinMatchday = require("../utils/timeValidations");

const { calcGameScore } = require("../utils/gameScores")

const saveGame = (Game) => async ({ player, category, gameWeek, score }) => {

    const newGame = new Game({ player, category, gameWeek, score })

    return newGame.save()
}


const submitGame = (Game, userService) => async ({ gameWeek, category, playerId, answers, demo, today = new Date() }) => {

    let user = await userService.getUserById(playerId);
    if (!user)
        throw new Error("User does not exist");

    const gameScore = await calcGameScore(answers);

    let responseData = { gameScore, playerId, demo, gameId: null }

    if(!demo){
        const inGameWeek = checkTodayWithinMatchday(today);

        if(inGameWeek){
            const updatedUser = await userService.updateGameRecords({ playerId, gameScore: gameScore.totalScore })

            const newGame = await saveGame(Game)({ player: playerId, category, gameWeek, score: gameScore.totalScore })

            responseData.gameId = newGame._id;
            responseData.submitLate = false
        }else{
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



module.exports = (Game, userService) => {
    return {
        submitGame: submitGame(Game, userService),
        getGames: getGames(Game),
        getGameById: getGameById(Game),
        getGameByWeekday: getGameByWeekday(Game),
        saveGame: saveGame(Game)
    }
}