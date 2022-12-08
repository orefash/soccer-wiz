const passport = require('passport');

const requireAdminJwtAuth = passport.authenticate('admin-jwt', { session: false });

module.exports = requireAdminJwtAuth;
