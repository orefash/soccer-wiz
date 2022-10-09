require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var path = require('path')

const passport = require("passport");

const flash = require("express-flash");
const session = require("express-session");

app.use(
    session({
        secret: "secr3t",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(flash());

require("./config/google");

const PORT = 3000;

const mongoose = require('mongoose')

const db = 'mongodb://localhost:27017/soccerwiz'
mongoose.connect(
    db,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    (error) => {
        if (error) console.log(error)
    }
)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport");
require("./config/google");

const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
};

app.get("/profile", isLoggedIn, (req, res) => {
    res.render("profile.ejs", { user: req.user });
});


app.get("/", (req, res) => {
    res.render("index.ejs");
});



app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/",
        successRedirect: "/profile",
        failureFlash: true,
        successFlash: "Successfully logged in!",
    })
);

app.get("/auth/logout", (req, res) => {
    req.flash("success", "Successfully logged out");
    req.session.destroy(function () {
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });

app.listen(PORT, function () {
    console.log(`SaaSBase Authentication Server listening on port ${PORT}`);
});