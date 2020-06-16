const passport = require("passport");
const FacebookStrategy = require("passport-facebook");


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


facebookOptions = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id','name', 'displayName',  'email']
}

passport.use(
    new FacebookStrategy( facebookOptions ,
        (accessToken, refreshToken, profile, done)=>{
            done(null, profile._json);
        }
    )
); 