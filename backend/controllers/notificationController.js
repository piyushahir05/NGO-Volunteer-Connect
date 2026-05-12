const Notification = require('../models/Notification');
const User = require('../models/User');

// ─── existing handlers (unchanged) ──────────────────────────────────────────

exports.getMine = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    await Notification.updateOne(
      { _id: req.params.id, recipientId: req.user._id },
      { isRead: true }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipientId: req.user._id }, { isRead: true });
    res.json({ message: 'All marked as read' });
  } catch (err) {
    next(err);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipientId: req.user._id,
      isRead: false,
    });
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

// ─── NEW: NGO sends an invitation to a volunteer ─────────────────────────────
// POST /api/notifications/invite
// Body: { volunteerId, opportunityId, opportunityTitle }
// Auth: NGO user (role === 'NGO')
exports.sendInvite = async (req, res, next) => {
  try {
    const { volunteerId, opportunityId, opportunityTitle } = req.body;

    if (!volunteerId || !opportunityId) {
      return res.status(400).json({ message: 'volunteerId and opportunityId are required.' });
    }

    // Prevent duplicate pending invites for the same volunteer + opportunity
    const existing = await Notification.findOne({
      recipientId: volunteerId,
      relatedOpportunityId: opportunityId,
      type: 'invite',
      inviteStatus: 'pending',
    });
    if (existing) {
      return res.status(409).json({ message: 'An invitation is already pending for this volunteer.' });
    }

    // Resolve NGO name from the authenticated user
    const ngoUser = await User.findById(req.user._id).select('name').lean();
    const ngoName = ngoUser?.name || 'An NGO';

    const notification = await Notification.create({
      recipientId: volunteerId,
      type: 'invite',
      inviteStatus: 'pending',
      isRead: false,
      message: `${ngoName} has invited you to join "${opportunityTitle || 'an opportunity'}".`,
      relatedOpportunityId: opportunityId,
      relatedNgoId: req.user._id,
      meta: {
        ngoName,
        opportunityTitle: opportunityTitle || '',
      },
    });

    // Emit real-time notification if socket.io is available on the app
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${volunteerId}`).emit('notification', notification);
    }

    res.status(201).json({ message: 'Invitation sent.', notification });
  } catch (err) {
    next(err);
  }
};

// ─── NEW: Volunteer accepts or declines an invitation ────────────────────────
// PUT /api/notifications/:id/invite-respond
// Body: { action: 'accepted' | 'declined' }
// Auth: Volunteer user
exports.respondToInvite = async (req, res, next) => {
  try {
    const { action } = req.body;

    if (!['accepted', 'declined'].includes(action)) {
      return res.status(400).json({ message: "action must be 'accepted' or 'declined'." });
    }

    const notification = await Notification.findOne({
      _id: req.params.id,
      recipientId: req.user._id,
      type: 'invite',
    });

    if (!notification) {
      return res.status(404).json({ message: 'Invitation not found.' });
    }

    if (notification.inviteStatus !== 'pending') {
      return res.status(409).json({ message: 'This invitation has already been responded to.' });
    }

    notification.inviteStatus = action;
    notification.isRead = true;
    await notification.save();

    // Optionally notify the NGO about the volunteer's response
    const volunteerUser = await User.findById(req.user._id).select('name').lean();
    const volunteerName = volunteerUser?.name || 'A volunteer';

    const ngoNotification = await Notification.create({
      recipientId: notification.relatedNgoId,
      type: 'general',
      isRead: false,
      message: `${volunteerName} has ${action} your invitation for "${notification.meta?.opportunityTitle || 'the opportunity'}".`,
      relatedOpportunityId: notification.relatedOpportunityId,
      relatedVolunteerId: req.user._id,
    });

    // Emit real-time notification to NGO if socket.io is available
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${notification.relatedNgoId}`).emit('notification', ngoNotification);
    }

    res.json({ message: `Invitation ${action}.`, notification });
  } catch (err) {
    next(err);
  }
};