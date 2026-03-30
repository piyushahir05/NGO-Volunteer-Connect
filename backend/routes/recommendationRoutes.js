const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  getRecommendedOpportunities,
  getRecommendedVolunteers,
  searchRankedOpportunities,
} = require('../controllers/recommendationController');
const { protect, role } = require('../middleware/auth');

const router = express.Router();

// Rate limiter: max 30 recommendation requests per minute per IP
const recommendLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// GET /api/recommend/opportunities
// Returns top-10 opportunities ranked for the logged-in volunteer
router.get('/opportunities', recommendLimiter, protect, role('Volunteer'), getRecommendedOpportunities);

// GET /api/recommend/volunteers/:opportunityId
// Returns volunteers ranked by skill match for the NGO's opportunity
router.get('/volunteers/:opportunityId', recommendLimiter, protect, role('NGO'), getRecommendedVolunteers);

// GET /api/recommend/search?q=keyword
// Full-text search over opportunities ranked by TF-IDF cosine similarity (public)
router.get('/search', recommendLimiter, searchRankedOpportunities);

module.exports = router;
