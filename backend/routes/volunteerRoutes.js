const express = require('express');
const { body } = require('express-validator');
const { 
  getProfile, 
  updateProfile, 
  getMyApplications, 
  getDashboardStats,
  getMemories,
  addMemory
} = require('../controllers/volunteerController');
const { protect, role } = require('../middleware/auth');

const router = express.Router();

// All routes here require the user to be a logged-in Volunteer
router.use(protect, role('Volunteer'));

// Profile Routes
router.get('/profile', getProfile);
router.put(
  '/profile',
  [
    body('skills').optional().isArray(),
    body('interests').optional().isArray(), // Changed to isArray to match frontend
    body('availability').optional().isString(),
    body('location').optional().isString(),
    body('bio').optional().isString(),
    body('phone').optional().isString(),
    body('gender').optional().isString(),
  ],
  updateProfile
);

// Application & Dashboard Routes
router.get('/applications', getMyApplications);
router.get('/dashboard-stats', getDashboardStats);

// Impact Journal (Memories) Routes
router.get('/memories', getMemories);
router.post(
  '/memories',
  [
    body('opportunityId').notEmpty().withMessage('Opportunity ID is required'),
    body('opportunityTitle').notEmpty().withMessage('Opportunity Title is required'),
    body('rating').isNumeric().withMessage('Rating must be a number'),
    body('text').notEmpty().withMessage('Reflection text is required')
  ],
  addMemory
);

module.exports = router;