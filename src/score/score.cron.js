const { cronLogger } = require('../logger');
const { scoreService } = require('./index');

const CronJob = require('cron').CronJob;

exports.initDailyScoreReset = () => {

    cronLogger.info('Before daily score reset');

    const job = new CronJob('0 0 * * *', async function () {
        // const job = new CronJob('* * * * * *', async function () {
        const d = new Date();
        cronLogger.info(`At Midnight: ${d}`);

        try {
            let status = await scoreService.deleteScores(1);
            console.log("delete Daily score: ", status);
            cronLogger.info(`delete Daily score: ${status}`);
        } catch (error) {
            cronLogger.error(`delete Daily score error: ${error.message}`);
        }

    }, {
        scheduled: true,
        timezone: "Africa/Lagos"
    });
    job.start();
    

}

exports.initWeeklyScoreReset = () => {

    cronLogger.info('Before weekly score reset');

    const job = new CronJob('0 0 * * sun', async function () {
        // const job = new CronJob('* * * * * *', async function () {
        const d = new Date();
        cronLogger.info(`At New Week on sunday morning: ${d}`);

        try {
            let status = await scoreService.deleteScores(2);
            console.log("delete weekly score: ", status);
            cronLogger.info(`delete weekly score: ${status}`);
        } catch (error) {
            cronLogger.error(`delete weekly score error: ${error.message}`);
        }

    }, {
        scheduled: true,
        timezone: "Africa/Lagos"
    });
    job.start();
    

}


exports.initMonthlyScoreReset = () => {

    cronLogger.info('Before monthly score reset');

    const job = new CronJob('0 0 1 * *', async function () {
        // const job = new CronJob('* * * * * *', async function () {
        const d = new Date();
        cronLogger.info(`At New Month on Day 1: ${d}`);

        try {
            let status = await scoreService.deleteScores(3);
            console.log("delete monthly score: ", status);
            cronLogger.info(`delete monthly score: ${status}`);
        } catch (error) {
            cronLogger.error(`delete monthly score error: ${error.message}`);
        }

    }, {
        scheduled: true,
        timezone: "Africa/Lagos"
    });

    job.start();
    

}