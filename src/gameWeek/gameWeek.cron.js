const { logger } = require('../logger');
const { gameWeekService } = require('./index');

const CronJob = require('cron').CronJob;


exports.initScheduledJobs = () => {
    logger.info('Before update Gameweek job instantiation');
    const job = new CronJob('00 00 00 * * *', async function () {
        const d = new Date();
        logger.info(`At Midnight: ${d}`);

        try {
            let status = await gameWeekService.updateGameweekStatus();

            console.log("s: ", status);
            logger.info(`Update Gameweek Status: ${status}`);

        } catch (error) {
            logger.error(`Update Gameweek error: ${error.message}`);

        }
    });
    logger.info('After update Gameweek job instantiation');
    job.start();
}