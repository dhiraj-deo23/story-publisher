const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const FacebookUser = require("../Models/FacebookUser");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      profileFields: [
        "id",
        "displayName",
        "photos",
        "email",
        "birthday",
        "age_range",
        "friends",
        "hometown",
        "link",
        "first_name",
      ],
      callbackURL: "/auth/facebook/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        facebookId: profile.id,
        displayName: profile.displayName,
        email: profile._json.email,
        image: profile.photos[0].value,
        firstName: profile._json.first_name,
        hometown: profile._json.hometown.name,
        link: profile._json.link,
        birthday: profile._json.birthday,
        friendsCount: profile._json.friends.summary.total_count,
      };
      try {
        let user = await FacebookUser.findOne({ facebookId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await FacebookUser.create(newUser);
          done(null, user);
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
  FacebookUser.findById(id, (err, user) => {
    done(err, user);
  });
});
