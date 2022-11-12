const passport = require("passport");

const FacebookStrategy = require('passport-facebook');

const { userService } = require('../user')

const serverUrl = process.env.NODE_ENV === 'production' ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;


const facebookLogin = new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: `${serverUrl}${process.env.FACEBOOK_CALLBACK_URL}`,
      profileFields: [
        'id',
        'email',
        'gender',
        'profileUrl',
        'displayName',
        'locale',
        'name',
        'timezone',
        'updated_time',
        'verified',
        'picture.type(large)',
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
    


      const facebookId = profile.id;
            const email = profile.emails[0].value;
            const firstName = profile.displayName;
            const profilePhoto = profile.photos[0].value;


            // console.log("PID: ", profileId)


            const currentUser = await userService.getUserByEmail(email)

            if (!currentUser) {
                const newUser = await userService.addFacebookUser({
                    facebookId,
                    email,
                    firstName,
                    // username: `user${profile.id}`,
                    lastName,
                    profilePhoto,
                    
                })
                return done(null, newUser);
            }

            // if (currentUser.source != "facebook") {
            //     //return error
            //     return done(null, false, { message: `You have previously signed up with a different signin method` });
            // }

            // currentUser.lastVisited = new Date();

            // console.log("In google login: ", currentUser)
            return done(null, currentUser);



    },
  );
  
  passport.use(facebookLogin);