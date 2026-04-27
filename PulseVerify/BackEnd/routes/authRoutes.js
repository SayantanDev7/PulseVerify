import express from 'express';
import passport from 'passport';
import { verifyAndRegister } from '../controllers/authController.js';
import { checkAuth } from '../middleware/auth.js';

const router = express.Router();

// The frontend will call this after Firebase signs them in manually
router.post('/verify', checkAuth, verifyAndRegister);

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'https://pulse-verify.vercel.app'}/login?error=auth_failed` }),
  (req, res) => {
    // Successful authentication, redirect to frontend /vault
    res.redirect(`${process.env.FRONTEND_URL || 'https://pulse-verify.vercel.app'}/vault`);
  }
);

// Check current session
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
