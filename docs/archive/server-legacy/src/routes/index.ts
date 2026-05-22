import { Router } from 'express';
import aiRoutes from './aiRoutes.js';
import authRoutes from './authRoutes.js';
import driveRoutes from './driveRoutes.js';

const router = Router();

router.use('/ai', aiRoutes);
router.use('/auth', authRoutes);
router.use('/drive', driveRoutes);

export default router;
