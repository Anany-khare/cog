import express from 'express';
import { addRecruitment, submitResponse, getRecruitments, getRecruitmentResponses, closeRecruitment } from '../controllers/recruitment.controller.js';
import upload from '../middlewares/multer.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Org creates a recruitment post
router.post('/add', isAuthenticated, checkRole(['org']), addRecruitment);

// Gamer submits a response to a recruitment
router.post('/:recruitmentId/respond', isAuthenticated, checkRole(['gamer']), upload.single('screenshot'), submitResponse);

// Get all recruitments (optionally filter by org)
router.get('/', isAuthenticated, getRecruitments);

// Get responses for a specific recruitment (for orgs only)
router.get('/:recruitmentId/responses', isAuthenticated, checkRole(['org']), getRecruitmentResponses);

// Close a recruitment (stop responses)
router.patch('/close/:recruitmentId', isAuthenticated, checkRole('org'), closeRecruitment);

export default router; 