
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
    FacebookAuthController
} = require("./user");
const { QuestionController } = require("./question");
const { GameCategoryController } = require('./gameCategory')
const { GameSettingController } = require('./gameSettings')
const { ScoreController } = require('./score')
const { GameController } = require('./game')
const { WalletController } = require('./walletTransaction')
const { RewardController } = require('./reward')

app.use(passport.initialize());
// app.use(passport.session());
// require("./passportConfig/passport");
require("./passportConfig/local");
require("./passportConfig/google");
require("./passportConfig/jwt");
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

var whitelist = ['http://localhost:3001', 'http://localhost:3000', 'https://expensive-mite-housecoat.cyclic.app']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

// Then pass them to cors:
// app.use(cors(corsOptions));
// app.use(cors());
app.use(cors({
    origin: whitelist, // (Whatever your frontend url is) 
    credentials: true, // <= Accept credentials (cookies) sent by the client
}))
// app.use(cors({
//     origin: "*", // (Whatever your frontend url is) 
//     credentials: true, // <= Accept credentials (cookies) sent by the client
// }))


app.get("/api", (req, res) => {
    res.status(200).json({ alive: true });
});

app.use("/auth", GoogleAuthController);
app.use("/auth", LocalAuthController);
app.use("/auth", FacebookAuthController);
app.use("/api/questions", QuestionController);
app.use("/api/users", UserController);
app.use("/api/categories", GameCategoryController);
app.use("/api/settings", GameSettingController);
app.use("/api/scores", ScoreController);
app.use("/api/games", GameController);
app.use("/api/wallet/transactions", WalletController);
app.use("/api/rewards", RewardController);

module.exports = app;