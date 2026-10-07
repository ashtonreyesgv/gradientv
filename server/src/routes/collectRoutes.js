// which function answers which URL
// app.js mounts this at /api/collect and puts requireSiteKey in front of all of it.
// these are for a client's website to call, not a browser: nothing here reads the session cookie
import { Router } from 'express';
import { collectAssessment, collectSubscriber } from '../controllers/collectController.js';

const router = Router();

router.post('/assessment', collectAssessment);
router.post('/subscriber', collectSubscriber);

export default router;
