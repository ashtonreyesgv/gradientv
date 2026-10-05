// which function answers which URL
// app.js mounts this at /api/auth, so '/login' means /api/auth/login
import { Router } from 'express';
import { getInvite, login, logout, me, setPassword } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.post('/invite', getInvite);
router.post('/set-password', setPassword);

export default router;
