"use strict";
const { isValidTimePeriod } = require('../utils/timeValidations');

const addGameWeek = (GameWeek) => async ({ startDate, endDate, title, status }) => {

    if (!startDate || !endDate || !title)
        throw new Error('Invalid parameters');

    if (!isValidTimePeriod({ startDate, endDate }))
        throw new Error('Invalid Time Period');

    const savedGameWeek = new GameWeek({ startDate, endDate, title, status })

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

                    pipeline: [
                        {
                            $match: {
                                category: category
                            }
                        }],
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
            { $sort: { createdAt: -1 } }
        ]);

        return data;

    } catch (error) {
        console.log('err: ', error.message);
        throw new Error('in Game: ', error.message)
    }
}

const updateGameweekStatus = (GameWeek) => async () => {

    try {

        let today = new Date();

        let passedGameweeks = await GameWeek.updateMany(
            {
                endDate: {
                    $lt: today,
                }
            },
            {
                "$set": {
                    status: "Passed"
                }
            },
            {
                "multi": true
            }
        );

        // console.log('passed: ', passedGameweeks);

        let liveGameweeks = await GameWeek.updateMany(
            {
                startDate: {
                    $lte: today,
                },
                endDate: {
                    $gte: today,
                },
            },
            {
                "$set": {
                    status: "Live"
                }
            },
            {
                "multi": true
            }
        );


        // console.log('live: ', liveGameweeks);

        return true;

    } catch (error) {
        console.log('err: ', error.message);
        throw new Error('Update Gameweek: ', error.message)
    }



}


const getGameweekList = (GameWeek) => async (category) => {

    try {

        let data = {};

        let upcomingGameWeeks = await GameWeek.aggregate([
            {
                $match: {
                    status: "Scheduled"
                }
            },
            {
                "$lookup": {
                    "from": "question",
                    "localField": "_id",
                    "foreignField": "gameWeek",

                    pipeline: [
                        {
                            $match: {
                                category: category
                            }
                        }],
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
            {
                $match: {
                    Questions: { $gt: 0 }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        let liveGameWeeks = await GameWeek.aggregate([
            {
                $match: {
                    status: "Live"
                }
            },
            {
                "$lookup": {
                    "from": "question",
                    "localField": "_id",
                    "foreignField": "gameWeek",

                    pipeline: [
                        {
                            $match: {
                                category: category
                            }
                        }],
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
            {
                $match: {
                    Questions: { $gt: 0 }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        data.live = liveGameWeeks;
        data.upcoming = upcomingGameWeeks;

        return data;

    } catch (error) {
        console.log('err: ', error.message);
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
        getGameweekList: getGameweekList(GameWeek),
        getGameById: getGameById(GameWeek),
        deleteGameWeek: deleteGameWeek(GameWeek),
        updateGameweekStatus: updateGameweekStatus(GameWeek),
        updateGameWeek: updateGameWeek(GameWeek)
    }
}