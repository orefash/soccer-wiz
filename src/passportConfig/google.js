const passport = require("passport");
// const User = require("../user/user.model");
const GoogleStrategy = require("passport-google-oauth20").Strategy;



passport.use(
    new GoogleStrategy(
        {
            callbackURL: process.env.CALLBACK_URL,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
        },
        async (accessToken, refreshToken, profile, done) => {
            const { userService } = require('../user')

            // console.log("Inside google strategy")

            // console.log("Profile: ", profile)
            const id = profile.id;
            const email = profile.emails[0].value;
            const firstName = profile.name.givenName;
            const lastName = profile.name.familyName;
            const profilePhoto = profile.photos[0].value;
            const source = "google";


            const currentUser = await userService.getUserByEmail({ email })

            if (!currentUser) {
                const newUser = await userService.addGoogleUser({
                    
                    email,
                    firstName,
                    lastName,
                    profilePhoto
                })
                return done(null, newUser);
            }

            if (currentUser.source != "google") {
                //return error
                return done(null, false, { message: `You have previously signed up with a different signin method` });
            }

            currentUser.lastVisited = new Date();

            // console.log("In google login: ", currentUser)
            return done(null, currentUser);


        }
    )
);