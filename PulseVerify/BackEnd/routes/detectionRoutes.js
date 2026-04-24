import express from 'express';
import { detectViolation, getAllViolations } from '../controllers/detectController.js';
import { checkAuth } from '../middleware/auth.js';

const router = express.Router();

// All detection routes are protected
router.use(checkAuth);

router.post('/detect', detectViolation);
router.get('/', getAllViolations);

export default router;
