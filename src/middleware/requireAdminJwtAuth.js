

const passport = require('passport');
const redis = require('../redis')

const requireAdminJwtAuth = async (req, res, next) => {

  try {
    const token = req.headers["x-auth-token"]
    // console.log('token: ', token);

    if (!token)
      return res.status(401).send('Unauthorized!!');

    const result = await redis.sismember("token-blacklist", token)
    // console.log('toekn redis check: ', result)

    if (result === 1)
      return res.status(401).send('Unauthorized!!');

    // console.log("in edit require local")
    passport.authenticate('admin-jwt', (err, user, info) => {
      if (err) {
        // console.log("Errin ")
        return next(err);
      }
      if (!user) {
        return res.status(401).send({ success: false });
      }
      req.user = user;
      next();
    })(req, res, next);

  } catch (error) {
    return next(error);

  }

};

module.exports = requireAdminJwtAuth;
