import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import User from '../models/User.js';
import admin from 'firebase-admin'; // Keep firebase admin for existing features if needed

// Existing Bearer Strategy
passport.use(new BearerStrategy(async (token, done) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, phone_number, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user && email) {
      user = await User.findOne({ email });
    }
    
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error);
  }
}));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
    callbackURL: `${process.env.BACKEND_URL || 'https://pulseverify.onrender.com'}/auth/google/callback`,
    proxy: true // Required if behind a load balancer/proxy like Render
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        user = await User.create({
          firebaseUid: profile.id, // Using google ID
          email: profile.emails[0].value,
          lastLogin: new Date()
        });
      } else {
        user.lastLogin = new Date();
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
