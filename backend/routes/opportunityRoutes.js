const express = require('express');
const { body } = require('express-validator');
const {
  list,
  getOne,
  create,
  update,
  apply,
  updateApplicationStatus,
  getApplicants,
  getRecommendedVolunteers,          // ← ADDED
} = require('../controllers/opportunityController');
const { protect, role } = require('../middleware/auth');
 
const router = express.Router();
 
router.get('/', list);
router.get('/:id', getOne);
 
router.post('/:id/apply', protect, role('Volunteer'), apply);
 
router.post(
  '/',
  protect,
  role('NGO'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('requiredSkills').optional(),
    body('duration').optional().isString(),
    body('location').optional().isString(),
  ],
  create
);
 
router.put(
  '/:id',
  protect,
  role('NGO'),
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().isString(),
    body('requiredSkills').optional(),
    body('duration').optional().isString(),
    body('location').optional().isString(),
  ],
  update
);
 
router.get('/:id/applicants',             protect, role('NGO'), getApplicants);
router.get('/:id/recommended-volunteers', protect, role('NGO'), getRecommendedVolunteers); // ← ADDED
 
router.put(
  '/:oppId/applicants/:applicantId/status',
  protect,
  role('NGO'),
  [body('status').isIn(['Accepted', 'Rejected'])],
  updateApplicationStatus
);
 
module.exports = router;