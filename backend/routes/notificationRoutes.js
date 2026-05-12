const express = require('express');
const {
  getMine,
  markRead,
  markAllRead,
  getUnreadCount,
  sendInvite,
  respondToInvite,
} = require('../controllers/notificationController');
const { protect, role } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// ── existing routes ──────────────────────────────────────────────────────────
router.get('/', getMine);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);

// ── NEW: invite routes ───────────────────────────────────────────────────────
// Only NGO users can send invites
router.post('/invite', role('NGO'), sendInvite);

// Only Volunteers can respond to invites
router.put('/:id/invite-respond', role('Volunteer'), respondToInvite);

module.exports = router;