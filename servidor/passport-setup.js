const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function (user, done) {
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  //User.findById(id, function(err, user) {
  done(null, user);
  //});
});

passport.use(new GoogleStrategy({
  clientID: "46048914063-lk05vack5uk02sebgt87889c4splovsc.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "https://procesosis-7vxrmq2h4a-no.a.run.app/google/callback"

},
  function (accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return done(null, profile);
    //});
  }
));