

const https = require('https');
const { readFileSync } = require('fs')
const { resolve, join } = require('path')


const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === 'production';



var port = process.env.PORT || process.env.PORT || 3000;

const mongodbUri = isProduction ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;


mongoose.connect(
    mongodbUri,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }
).then(() => {
    if (isProduction) {
        app.listen(port, console.log("Server started on port - ", port));
    } else {

        const httpsOptions = {
            key: readFileSync(resolve(__dirname, './security/cert.key')),
            cert: readFileSync(resolve(__dirname, './security/cert.pem')),

            rejectUnauthorized: false
        };

        const server = https.createServer(httpsOptions, app).listen(port, () => {
            console.log('https server running at ' + port);
            // console.log(all_routes(app));
        });
        // app.listen(port, console.log("Server started on port - ", port));
    }

}).catch((err) => {
    console.log(err);
});


