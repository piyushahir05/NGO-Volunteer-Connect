const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile, getMyApplications } = require('../controllers/volunteerController');
const { protect, role } = require('../middleware/auth');

const router = express.Router();
router.use(protect, role('Volunteer'));

router.get('/profile', getProfile);
router.put(
  '/profile',
  [
    body('skills').optional().isArray(),
    body('interests').optional().isString(),
    body('availability').optional().isString(),
    body('location').optional().isString(),
  ],
  updateProfile
);
router.get('/applications', getMyApplications);

module.exports = router;
