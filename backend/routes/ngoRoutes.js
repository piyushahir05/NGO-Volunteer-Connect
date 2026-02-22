const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile, getMyOpportunities } = require('../controllers/ngoController');
const { protect, role } = require('../middleware/auth');

const router = express.Router();
router.use(protect, role('NGO'));

router.get('/profile', getProfile);
router.put(
  '/profile',
  [
    body('organizationName').optional().trim().notEmpty(),
    body('description').optional().isString(),
  ],
  updateProfile
);
router.get('/opportunities', getMyOpportunities);

module.exports = router;
