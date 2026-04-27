import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import User from "../models/User.js";
import { admin } from "./firebase.js";

// ── Google OAuth Strategy ───────────────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://pulseverify.onrender.com/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            user.googleId = profile.id;
            user.name = profile.displayName;
            user.picture = profile.photos[0]?.value;
            await user.save();
          } else {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              picture: profile.photos[0]?.value,
            });
          }
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// ── Bearer Strategy (for Firebase Token backward compatibility) ─────────────
passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, email, name, picture } = decodedToken;

      let user = await User.findOne({ firebaseUid: uid });

      if (!user) {
        user = await User.findOne({ email });
        if (user) {
          user.firebaseUid = uid;
          await user.save();
        } else {
          user = await User.create({
            firebaseUid: uid,
            email,
            name: name || email.split("@")[0],
            picture,
          });
        }
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
