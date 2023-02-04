"use strict";
const { isValidTimePeriod } = require('../utils/timeValidations');

const addGameWeek = (GameWeek) => async ({ startDate, endDate, title }) => {

    if (!startDate || !endDate || !title)
        throw new Error('Invalid parameters');

    if (!isValidTimePeriod({ startDate, endDate }))
        throw new Error('Invalid Time Period');

    const savedGameWeek = new GameWeek({ startDate, endDate, title })

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

const getGameById = (GameWeek) => async (_id) => {
    let game = await GameWeek.findOne({ _id })

    if (!game) return game;
    return game.toJSON();
}

const getGameweekQuestionInfo = (GameWeek) => async (category) => {

    try {

        let data = await GameWeek.aggregate([
            {
                "$lookup": {
                    "from": "question",
                    "localField": "_id",
                    "foreignField": "gameWeek",
                    "as": "Questions"
                }
            },
            {
                "$addFields": {
                    "Questions": {
                        $size: "$Questions"
                    }
                }
            },
            { $sort : { createdAt : -1 } }
        ])


        return data;


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


module.exports = (GameWeek) => {
    return {
        getGameweekQuestionInfo: getGameweekQuestionInfo(GameWeek),
        addGameWeek: addGameWeek(GameWeek),
        getGameWeeks: getGameWeeks(GameWeek),
        getGameById: getGameById(GameWeek),
        deleteGameWeek: deleteGameWeek(GameWeek),
        updateGameWeek: updateGameWeek(GameWeek)
    }
}