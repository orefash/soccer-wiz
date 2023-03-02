const { cronLogger } = require('../logger');
const { gameWeekService } = require('./index');

const CronJob = require('cron').CronJob;


exports.initScheduledJobs = () => {
    cronLogger.info('Before update Gameweek job instantiation');
    const job = new CronJob('0 21 * * *', async function () {
        // const job = new CronJob('* * * * * *', async function () {
        const d = new Date();
        cronLogger.info(`At Midnight: ${d}`);

        try {
            let status = await gameWeekService.updateGameweekStatus();
            console.log("s: ", status);
            cronLogger.info(`Update Gameweek Status: ${status}`);
        } catch (error) {
            cronLogger.error(`Update Gameweek error: ${error.message}`);
        }

    }, {
        scheduled: true,
        timezone: "Africa/Lagos"
    });
    cronLogger.info('After update Gameweek job instantiation');
    job.start();
}