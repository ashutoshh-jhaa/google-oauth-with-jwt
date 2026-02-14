import { Strategy as googleStrategy } from "passport-google-oauth20";
import { config } from "dotenv";
config({ quiet: true });
import passport from "passport";

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
      };

      cb(null, user);
    },
  ),
);

export default passport;
