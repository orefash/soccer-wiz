const passport = require('passport');

const requireAdminAuth = (req, res, next) => {
  console.log("in require admin")
  passport.authenticate('admin', (err, user, info) => {
    if (err) {
      console.log("Errin ")
      return next(err);
    }
    if (!user) {
      return res.status(422).send(info);
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = requireAdminAuth;
