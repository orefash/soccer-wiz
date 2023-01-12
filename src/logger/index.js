"use strict";

const expressWinston = require("express-winston");
const { transports, format } = require('winston');
require("winston-mongodb")

const isProduction = process.env.NODE_ENV === 'production';
const mongodbUri = isProduction ? process.env.MONGO_URI_PROD_LOG : process.env.MONGO_URI_DEV_LOG;

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');
module.exports = {
    logger: expressWinston.logger({
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
        ),
        statusLevels: true
    })
}