
require("dotenv").config();
const cors = require('cors');

var path = require('path')
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");

const {
    GoogleAuthController,
    UserController,
    LocalAuthController,
    FacebookAuthController,
    AdminController
} = require("./user");
const { QuestionController } = require("./question");
const { GameCategoryController } = require('./gameCategory')
const { GameSettingController } = require('./gameSettings')
const { ScoreController } = require('./score')
const { GameController } = require('./game')
const { WalletController } = require('./walletTransaction')
const { RewardController } = require('./reward')
const { FlwController } = require('./flutterwave')
const { GameWeekController } = require('./gameWeek')

app.use(passport.initialize());
require("./passportConfig/local");
require("./passportConfig/admin");
require("./passportConfig/google");
require("./passportConfig/userJwt");
require("./passportConfig/adminJwt");
require("./passportConfig/facebook");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const sessionSecret = process.env.SESSION_KEY;

app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
    })
);

var whitelist = ['http://localhost:3001', 'http://localhost:3000', 'https://expensive-mite-housecoat.cyclic.app', 'https://soccerwiz.netlify.app']

app.use(cors({
    origin: whitelist, // (Whatever your frontend url is) 
    credentials: true, // <= Accept credentials (cookies) sent by the client
}))

const mongoose = require('mongoose');
const serverStatus = () => {
    return {
        state: 'up',
        dbState: mongoose.STATES[mongoose.connection.readyState]
    }
};

app.get("/api/uptime", (req, res) => {
    res.status(200).json(
        serverStatus()
    );
});

app.use("/auth", GoogleAuthController);
app.use("/auth", LocalAuthController);
app.use("/auth", FacebookAuthController);
app.use("/api/questions", QuestionController);
app.use("/api/users", UserController);
app.use("/api/admins", AdminController);
app.use("/api/categories", GameCategoryController);
app.use("/api/settings", GameSettingController);
app.use("/api/scores", ScoreController);
app.use("/api/games", GameController);
app.use("/api/wallet/transactions", WalletController);
app.use("/api/rewards", RewardController);
app.use("/api/payments", FlwController);
app.use("/api/gameWeeks", GameWeekController);

module.exports = app;