const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },

    // ── NEW: notification type ──────────────────────────────────────────────
    // 'general'  – plain info notification (existing behaviour)
    // 'invite'   – NGO inviting a volunteer to an opportunity
    type: {
      type: String,
      enum: ["general", "invite"],
      default: "general",
    },

    // ── NEW: invite status (only relevant when type === 'invite') ───────────
    // 'pending'  – volunteer hasn't responded yet
    // 'accepted' – volunteer accepted the invite
    // 'declined' – volunteer declined the invite
    inviteStatus: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },

    relatedOpportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
    },
    relatedNgoId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    relatedVolunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── NEW: store NGO name & opportunity title so the volunteer card renders
    //         without extra DB lookups ───────────────────────────────────────
    meta: {
      ngoName: { type: String, default: "" },
      opportunityTitle: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);