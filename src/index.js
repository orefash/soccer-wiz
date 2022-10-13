require("dotenv").config();

const cors = require('cors');

var path = require('path')
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const { AuthController } = require("./user");

require("./passportConfig/passport");
require("./passportConfig/local");
require("./passportConfig/google");

const mongodbUri = process.env.MONGO_URI;

mongoose.connect(
  mongodbUri,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (error) => {
    if (error) console.log(error);
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(
  session({
    secret: "secr3t",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());
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
    origin : "http://localhost:3001", // (Whatever your frontend url is) 
    credentials: true, // <= Accept credentials (cookies) sent by the client
  }))

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};


app.use("/auth", AuthController);

var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

app.listen(port, function () {
  console.log(`SaaSBase Authentication Server listening on port ${port}`);
});