

const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

const mongodbUri = process.env.MONGO_URI;

mongoose.connect(
    mongodbUri,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }
).then(() => {
    app.listen(port, console.log("Server started on port - ", port));
}).catch((err) => {
    console.log(err);
});


