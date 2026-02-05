import { Router } from 'express';
import { getAllUsers } from '../controllers/users.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireRole('ADMIN'), getAllUsers);

export default router;
