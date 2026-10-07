// which function answers which URL
// app.js mounts this at /api/site-data and puts requireAuth in front of all of it
import { Router } from 'express';
import { getAssessments, getSubscribers } from '../controllers/siteDataController.js';

const router = Router();

router.get('/assessments', getAssessments);
router.get('/subscribers', getSubscribers);

export default router;
