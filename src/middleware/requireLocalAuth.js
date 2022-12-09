const passport = require('passport');

const requireLocalAuth = (req, res, next) => {
  // console.log("in require local")
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      // console.log("Errin ")
      return next(err);
    }
    if (!user) {
      return res.status(422).send(info);
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = requireLocalAuth;
