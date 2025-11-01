import { Router } from 'express';
import drugRoutes from './drugRoutes';

const router = Router();

// Mount drug routes
router.use('/api', drugRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Drug Inventory API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;