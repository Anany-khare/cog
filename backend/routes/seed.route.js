import { Router } from 'express';
import { seedDatabase } from '../controllers/seed.controller.js';

const router = Router();

router.route('/seed').post(seedDatabase);

export default router; 