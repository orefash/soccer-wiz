"use strict";
const mongoose = require("mongoose");

const isProduction = process.env.NODE_ENV === 'production';

// const mongodbUri = process.env.MONGO_URI_PROD;
const mongodbUri = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;
mongoose.set('useUnifiedTopology', true);

mongoose.connect(
    mongodbUri,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        retryWrites: false
    }
)
mongoose.set('useUnifiedTopology', true);

const conn = mongoose.connection;

module.exports = conn;