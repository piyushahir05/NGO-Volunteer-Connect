const NGOProfile = require('../models/NGOProfile');
const Opportunity = require('../models/Opportunity');
const { validationResult } = require('express-validator');

exports.getProfile = async (req, res, next) => {
  try {
    let profile = await NGOProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await NGOProfile.create({
        userId: req.user._id,
        organizationName: req.user.name,
      });
    }
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { organizationName, description } = req.body;
    let profile = await NGOProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new NGOProfile({ userId: req.user._id, organizationName: req.user.name });
    }
    if (organizationName !== undefined) profile.organizationName = organizationName;
    if (description !== undefined) profile.description = description;
    await profile.save();
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.getMyOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ ngoId: req.user._id })
      .populate('applicants.volunteerId', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    res.json(opportunities);
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ ngoId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const activeEvents = opportunities.length;

    const volunteerIds = new Set();
    let pendingApplications = 0;

    for (const opp of opportunities) {
      for (const a of opp.applicants || []) {
        if (a.volunteerId) volunteerIds.add(a.volunteerId.toString());
        if (a.status === 'Pending') pendingApplications++;
      }
    }

    const totalVolunteers = volunteerIds.size;

    const events = opportunities.map((opp) => {
      const applicants = opp.applicants || [];
      const total = applicants.length;
      const counts = applicants.reduce(
        (acc, a) => {
          if (a.status === 'Accepted') acc.accepted++;
          else if (a.status === 'Pending') acc.pending++;
          else if (a.status === 'Rejected') acc.rejected++;
          return acc;
        },
        { accepted: 0, pending: 0, rejected: 0 }
      );
      return {
        _id: opp._id,
        title: opp.title,
        requiredSkills: opp.requiredSkills || [],  // ← ADDED
        totalApplicants: total,
        accepted: counts.accepted,
        pending: counts.pending,
        rejected: counts.rejected,
        fillRate: total > 0 ? Math.round((counts.accepted / total) * 100) : 0,
      };
    });

    res.json({
      activeEvents,
      totalVolunteers,
      pendingApplications,
      events,
    });
  } catch (err) {
    next(err);
  }
};