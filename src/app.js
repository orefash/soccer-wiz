
require("dotenv").config();
const cors = require('cors');

var path = require('path')
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");

const { GoogleAuthController, UserController, LocalAuthController, FacebookAuthController } = require("./user");
const { QuestionController } = require("./question");

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
app.use(
    session({
        secret: "secr3t",
        resave: false,
        saveUninitialized: true,
    })
);

var whitelist = ['http://localhost:3001', 'http://localhost:3000']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

// Then pass them to cors:
// app.use(cors(corsOptions));
// app.use(cors());
app.use(cors({
    origin: "http://localhost:3001", // (Whatever your frontend url is) 
    credentials: true, // <= Accept credentials (cookies) sent by the client
}))



const isLoggedIn = (req, res, next) => {
    // console.log("In login check: ", req.user)
    req.user ? next() : res.sendStatus(401);
};

app.get("/api", (req, res) => {
    res.status(200).json({ alive: true });
});

app.use("/auth", GoogleAuthController);
app.use("/auth", LocalAuthController);
app.use("/auth", FacebookAuthController);
app.use("/api/questions", QuestionController);
app.use("/api/users", UserController);

module.exports = app;