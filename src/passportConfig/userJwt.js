const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../user')


// const isProduction = process.env.NODE_ENV === 'production';
// const secretOrKey =  "secret";
const secretOrKey =  process.env.JWT_SECRET;

// console.log("jwt fetch: ", jwtfetch)
// JWT strategy
const jwtLogin = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromHeader('x-auth-token'),
    secretOrKey,
  },
  async (payload, done) => {
    try {
      // console.log("payload: ", payload)
      const user = await User.findById(payload.id);

      // console.log("in jwt: ", user)
      if (user && user.role === 'USER') {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  },
);

passport.use('user-jwt', jwtLogin);
