// which function answers which URL
// app.js mounts this at /api/requests, so '/' means /api/requests.
// app.js also puts requireAuth in front of all of it, so nothing here works signed out
import { Router } from 'express';
import { createRequest, listRequests, setStatus } from '../controllers/requestController.js';
import { requireAdmin } from '../middleware/requireAuth.js';

const router = Router();

router.get('/', listRequests);
router.post('/', createRequest);
router.patch('/:id', requireAdmin, setStatus);

export default router;
