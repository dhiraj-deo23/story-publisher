const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GoogleUser = require("../Models/GoogleUser");
const passport = require("passport");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value,
      };
      try {
        let user = await GoogleUser.findOne({ googleId: profile.id });
        if (user) {
          cb(null, user);
        } else {
          user = await GoogleUser.create(newUser);
          cb(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  GoogleUser.findById(id, (err, user) => {
    done(err, user);
  });
});
