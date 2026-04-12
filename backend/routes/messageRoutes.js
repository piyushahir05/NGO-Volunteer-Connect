const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const Opportunity = require("../models/Opportunity");
const Notification = require("../models/Notification");

const { protect } = require("../middleware/auth");
const { emitToConversation, emitToUser } = require("../config/socket");

const convId = (ngoId, volunteerId) => `${ngoId}_${volunteerId}`;

// ════════════════════════════════════════════
// NGO ROUTES
// ════════════════════════════════════════════

router.get("/ngo/conversations", protect, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      ngoId: req.user._id,
    }).populate("applicants.volunteerId", "name email");

    const volunteerMap = {};
    opportunities.forEach((opp) => {
      opp.applicants.forEach((app) => {
        const v = app.volunteerId;
        if (v && !volunteerMap[v._id]) {
          volunteerMap[v._id] = { _id: v._id, name: v.name, email: v.email };
        }
      });
    });

    const volunteers = await Promise.all(
      Object.values(volunteerMap).map(async (v) => {
        const cid = convId(req.user._id, v._id);
        const latest = await Message.findOne({ conversationId: cid }).sort({ createdAt: -1 });
        const unread = await Message.countDocuments({
          conversationId: cid,
          senderRole: "volunteer",
          read: false,
        });
        return {
          ...v,
          conversationId: cid,
          latestMessage: latest?.text || null,
          latestAt: latest?.createdAt || null,
          unread,
        };
      })
    );

    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/ngo/:volunteerId", protect, async (req, res) => {
  try {
    const cid = convId(req.user._id, req.params.volunteerId);
    const messages = await Message.find({ conversationId: cid }).sort({ createdAt: 1 });

    await Message.updateMany(
      { conversationId: cid, senderRole: "volunteer", read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/ngo/:volunteerId", protect, async (req, res) => {
  try {
    const volunteerId = req.params.volunteerId;
    const cid = convId(req.user._id, volunteerId);

    const msg = await Message.create({
      conversationId: cid,
      senderId: req.user._id,
      senderRole: "ngo",
      text: req.body.text,
    });

    const notification = await Notification.create({
      recipientId: volunteerId,
      message: `New message from ${req.user.name}`,
      relatedNgoId: req.user._id,       // ✅ NGO's ID — volunteer uses this to navigate
      relatedVolunteerId: volunteerId,   // ✅ extra context
    });

    emitToUser(volunteerId, "notification", notification);
    emitToConversation(cid, "newMessage", msg);

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ════════════════════════════════════════════
// VOLUNTEER ROUTES
// ════════════════════════════════════════════

router.get("/volunteer/conversations", protect, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({
      "applicants.volunteerId": req.user._id,
    }).populate("ngoId", "name email");

    const ngoMap = {};
    opportunities.forEach((opp) => {
      const n = opp.ngoId;
      if (n && !ngoMap[n._id]) {
        ngoMap[n._id] = { _id: n._id, name: n.name, email: n.email };
      }
    });

    const ngos = await Promise.all(
      Object.values(ngoMap).map(async (n) => {
        const cid = convId(n._id, req.user._id);
        const latest = await Message.findOne({ conversationId: cid }).sort({ createdAt: -1 });
        const unread = await Message.countDocuments({
          conversationId: cid,
          senderRole: "ngo",
          read: false,
        });
        return {
          ...n,
          conversationId: cid,
          latestMessage: latest?.text || null,
          latestAt: latest?.createdAt || null,
          unread,
        };
      })
    );

    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/volunteer/:ngoId", protect, async (req, res) => {
  try {
    const cid = convId(req.params.ngoId, req.user._id);
    const messages = await Message.find({ conversationId: cid }).sort({ createdAt: 1 });

    await Message.updateMany(
      { conversationId: cid, senderRole: "ngo", read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/volunteer/:ngoId", protect, async (req, res) => {
  try {
    const ngoId = req.params.ngoId;
    const cid = convId(ngoId, req.user._id);

    const msg = await Message.create({
      conversationId: cid,
      senderId: req.user._id,
      senderRole: "volunteer",
      text: req.body.text,
    });

    const notification = await Notification.create({
      recipientId: ngoId,
      message: `New message from ${req.user.name}`,
      relatedNgoId: ngoId,               // ✅ NGO's own ID
      relatedVolunteerId: req.user._id,  // ✅ NGO uses this to navigate to volunteer chat
    });

    emitToUser(ngoId, "notification", notification);
    emitToConversation(cid, "newMessage", msg);

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;