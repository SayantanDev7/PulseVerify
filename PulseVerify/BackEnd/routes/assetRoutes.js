import express from 'express';
import { handleNewUpload, getAllAssets, getAssetById, getAssetStatus, updateAsset, deleteAsset } from '../controllers/assetController.js';
import { checkAuth } from '../middleware/auth.js';

const router = express.Router();

// All asset routes are protected
router.use(checkAuth);

router.get('/', getAllAssets);
router.get('/:id', getAssetById);
router.get('/:id/status', getAssetStatus);
router.post('/upload', handleNewUpload);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

export default router;
