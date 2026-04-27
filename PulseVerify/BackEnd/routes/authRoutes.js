import express from 'express';
import passport from 'passport';
import { verifyAndRegister } from '../controllers/authController.js';
import { checkAuth } from '../middleware/auth.js';

const router = express.Router();

// ── Google OAuth Routes ─────────────────────────────────────────────────────

// Initial request to Google
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account' 
}));

// Callback from Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }),
  (req, res) => {
    // Successful login, redirect to frontend
    const frontendUrl = process.env.FRONTEND_URL || "https://your-frontend-domain.vercel.app";
    res.redirect(`${frontendUrl}/vault`);
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed" });
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// Check current user session
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
});

// ── Firebase Auth Sync (Existing) ──────────────────────────────────────────
// The frontend calls this after Firebase signs them in (if using Firebase)
router.post('/verify', checkAuth, verifyAndRegister);

export default router;
