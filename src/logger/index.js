"use strict";

const expressWinston = require("express-winston");
const { transports, format, createLogger } = require('winston');
require("winston-mongodb")

const isProduction = process.env.NODE_ENV === 'production';
const mongodbUri = isProduction ? process.env.MONGO_URI_PROD_LOG : process.env.MONGO_URI_DEV_LOG;

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.MongoDB({
            db: mongodbUri,
            useUnifiedTopology: true,
            collection: 'logs'
        })
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.metadata(),
        format.prettyPrint()
    )
})
const cronLogger = createLogger({
    transports: [
        new transports.Console(),
        new transports.MongoDB({
            db: mongodbUri,
            useUnifiedTopology: true,
            collection: 'cron-logs'
        })
    ],
    format: format.combine(
        format.json(),
        format.timestamp(),
        format.metadata(),
        format.prettyPrint()
    )
})
module.exports = {
    appLogger: expressWinston.logger({
        winstonInstance: logger,
        statusLevels: true
    }),
    logger: logger,
    cronLogger: cronLogger
}