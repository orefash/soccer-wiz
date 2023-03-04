"use strict";

const https = require('https');
const { readFileSync } = require('fs')
const { resolve, join } = require('path')
require("dotenv").config();
const dbconn = require('./src/db')


const app = require("./src/app");

const isProduction = process.env.NODE_ENV === 'production';


const isTest = process.env.IS_TEST === 'true';

var port = process.env.PORT || 3000;


dbconn.on('error', () => console.error.bind(console, 'MongoDB Connection error'));

dbconn.once('open', () => {
    console.info('Connection to MongoDB is successful')
    if (isProduction && !isTest) {
        app.listen(port, console.log("Server started on port - ", port));
    } else {

        const httpsOptions = {
            key: readFileSync(resolve(__dirname, './src/security/cert.key')),
            cert: readFileSync(resolve(__dirname, './src/security/cert.pem')),

            rejectUnauthorized: false
        };

        const server = https.createServer(httpsOptions, app).listen(port, () => {
            console.log('Dev server running at : ' + port);
        });
    }

});



