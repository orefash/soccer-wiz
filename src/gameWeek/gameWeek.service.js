"use strict";
const { isValidTime, isValidTimePeriod } = require('../utils/timeValidations');

const addGameWeek = (GameWeek) => async ({ gameWeek, startDate, endDate, startTime, endTime, title }) => {

    if (!startDate || !endDate || !gameWeek || !endTime || !startTime )
        throw new Error('Invalid parameters');

    if(!isValidTimePeriod({ startDate, endDate, startTime, endTime }))
        throw new Error('Invalid Time Period');

    let ntitle;
    if (!title) ntitle = "Match Day " + gameWeek;

    const savedGameWeek = new GameWeek({ gameWeek, startDate, endDate, title: ntitle, startTime, endTime })

    let savedData = await savedGameWeek.save();
    return savedData.toJSON();
}


const getGameWeeks = (GameWeek) => async () => {
    const gameWeeks = await GameWeek.find();

    if (gameWeeks.length > 0) {
        let gw = gameWeeks.map(function (week) {
            return week.toJSON()
        });
        return gw;
    }

    return gameWeeks;
}

const getGameByWeek = (GameWeek) => async (gameWeek) => {
    let game = await GameWeek.findOne({ gameWeek })

    if (!game) return game;
    return game.toJSON();
}

const getGameweekQuestionInfo = (GameWeek, questionService) => async (category) => {

    try {

        let qData = questionService.getGameWeekQuestionData(category);

        const gameweeks = await GameWeek.find({}, { endDate: 0, _id: 0, __v: 0 }).sort({ gameWeek: 'desc' });

        let diff = gameweeks.filter(object1 => {
            return !qData.some(object2 => {
                return object1.gameWeek === object2.gameWeek;
            });
        });



        if (diff.length > 0) {
            let diffArray = diff.map((x) => {
                x = x.toObject();
                return { ...x, count: 0 }
            });
            return qData.concat(diffArray);
        }
        return qData;


    } catch (error) {
        console.log('err: ', error.message)
        throw new Error('in Game: ', error.message)
    }
}


const deleteGameWeek = (GameWeek) => async (_id) => {
    const data = await GameWeek.deleteOne({ _id })

    if (data.deletedCount === 1) return true

    return false;
}

const updateGameWeek = (GameWeek) => async (id, updateQuery = {}) => {

    const updatedGameWeek = await GameWeek.findByIdAndUpdate(id, updateQuery, {
        new: true,
    });

    if (!updatedGameWeek) return updatedGameWeek;
    return updatedGameWeek.toJSON();
}


module.exports = (GameWeek, questionService) => {
    return {
        getGameweekQuestionInfo: getGameweekQuestionInfo(GameWeek, questionService),
        addGameWeek: addGameWeek(GameWeek),
        getGameWeeks: getGameWeeks(GameWeek),
        getGameByWeek: getGameByWeek(GameWeek),
        deleteGameWeek: deleteGameWeek(GameWeek),
        updateGameWeek: updateGameWeek(GameWeek)
    }
}