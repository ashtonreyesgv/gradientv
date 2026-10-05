// which function answers which URL
// app.js mounts this at /api/stats, behind requireAuth
import { Router } from 'express';
import { getStats } from '../controllers/statsController.js';

const router = Router();

router.get('/', getStats);

export default router;
