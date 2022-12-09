
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { userService } = require('../user')
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({ // or whatever you want to use
  usernameField: 'phone',    // define the parameter in req.body that passport can use as username and password
  passwordField: 'password'
},

  async function (phone, password, done) {

    // console.log("in local")
    try {

      const currentUser = await userService.getUserByPhone(phone)
      // const currentUser = await userService.getUserByEmail(email)

      if (!currentUser) {
        return done(null, false, { success: false, message: `User with phone ${phone} does not exist` });
      }

      if (currentUser.source != "local") {
        return done(null, false, { success: false,  message: `You have previously signed up with a different signin method` });
      }

      if (!bcrypt.compareSync(password, currentUser.password)) {
        return done(null, false, { success: false,  message: `Incorrect password provided` });
      }
      return done(null, currentUser);

    } catch (err) {
      // console.log('error in login')
      return done(err);
    }

  }
));