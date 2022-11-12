const passport = require("passport");
// const User = require("../user/user.model");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


const { userService } = require('../user')


passport.use(
    new GoogleStrategy(
        {
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        async (accessToken, refreshToken, profile, done) => {

            // console.log("Inside google strategy")

            // console.log("Profile: ", profile)
            const googleId = profile.id;
            const email = profile.emails[0].value;
            const firstName = profile.name.givenName;
            const profilePhoto = profile.photos[0].value;


            // console.log("PID: ", profileId)


            const currentUser = await userService.getUserByEmail(email)

            if (!currentUser) {
                const newUser = await userService.addGoogleUser({
                    googleId,
                    email,
                    // username: `user${profile.id}`,
                    profilePhoto,
                    
                })
                return done(null, newUser);
            }

            // if (currentUser.source != "google") {
            //     //return error
            //     return done(null, false, { message: `You have previously signed up with a different signin method` });
            // }

            // currentUser.lastVisited = new Date();

            // console.log("In google login: ", currentUser)
            return done(null, currentUser);


        }
    )
);