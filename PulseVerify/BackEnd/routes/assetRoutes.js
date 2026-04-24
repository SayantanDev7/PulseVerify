import express from 'express';
import { handleNewUpload, getAllAssets, getAssetById } from '../controllers/assetController.js';
import { checkAuth } from '../middleware/auth.js';

const router = express.Router();

// All asset routes are protected
router.use(checkAuth);

router.post('/upload', handleNewUpload);
router.get('/', getAllAssets);
router.get('/:id', getAssetById);

export default router;
