"use strict";
const { isValidTimePeriod } = require('../utils/timeValidations');
// const { logger } = require('../logger');
const addGameWeek = (GameWeek) => async ({ startDate, endDate, title, status }) => {

    if (!startDate || !endDate || !title)
        throw new Error('Invalid parameters');

    if (!isValidTimePeriod({ startDate, endDate }))
        throw new Error('Invalid Time Period');

    let nStatus = 'Scheduled';

    let date = new Date(new Date().toISOString().split('T')[0]);

   
    if(date < startDate){
        nStatus = 'Scheduled';
    }else if(endDate < date){
        nStatus = 'Passed'
    }else{
        nStatus = 'Live'
    }

    if(!status){
        status = nStatus;
    }

    startDate = startDate + 'Z';
    endDate = endDate + 'Z';

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

        let today = new Date().toISOString().split('T')[0];

        // console.log(`today: ${today} - ISO: ${today} `)

        let passedGameweeks = await GameWeek.updateMany(
            {
                endDate: {
                    $lt: new Date().toISOString().split('T')[0],
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
        console.log('err: ', error);
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

const deleteGameWeeks = (GameWeek) => async () => {
    const data = await GameWeek.deleteMany({})

    return data;
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
        deleteGameWeeks: deleteGameWeeks(GameWeek),
        updateGameweekStatus: updateGameweekStatus(GameWeek),
        updateGameWeek: updateGameWeek(GameWeek)
    }
}