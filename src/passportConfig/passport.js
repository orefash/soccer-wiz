const passport = require("passport");
const User = require("../user/user.model");

passport.serializeUser((user, done) => {
  done(null, user.profileId);
});

passport.deserializeUser(async (profileId, done) => {
  // console.log("Userid: ", profileId)
  const currentUser = await User.findOne({ profileId});
  done(null, currentUser);
});