// which function answers which URL
// app.js mounts this at /api/admin, behind requireAuth and then requireAdmin,
// so a client's login gets a 403 from everything in here
import { Router } from 'express';
import { listClients } from '../controllers/adminController.js';

const router = Router();

router.get('/clients', listClients);

export default router;
