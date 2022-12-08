const passport = require('passport');

const requireUserJwtAuth = passport.authenticate('user-jwt', { session: false });

module.exports = requireUserJwtAuth;
