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
