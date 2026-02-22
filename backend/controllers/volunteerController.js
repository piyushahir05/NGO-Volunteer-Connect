const VolunteerProfile = require('../models/VolunteerProfile');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getProfile = async (req, res, next) => {
  try {
    let profile = await VolunteerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await VolunteerProfile.create({ userId: req.user._id });
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
    const { skills, interests, availability, location } = req.body;
    let profile = await VolunteerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new VolunteerProfile({ userId: req.user._id });
    }
    if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : [skills].filter(Boolean);
    if (interests !== undefined) profile.interests = interests;
    if (availability !== undefined) profile.availability = availability;
    if (location !== undefined) profile.location = location;
    await profile.save();
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({
      'applicants.volunteerId': req.user._id,
    })
      .populate('ngoId', 'name')
      .lean();
    const applications = opportunities.map((opp) => {
      const app = opp.applicants.find(
        (a) => a.volunteerId && a.volunteerId.toString() === req.user._id.toString()
      );
      return {
        _id: opp._id,
        ngoName: opp.ngoId?.name,
        title: opp.title,
        description: opp.description,
        requiredSkills: opp.requiredSkills,
        duration: opp.duration,
        location: opp.location,
        status: app?.status || 'Pending',
        appliedAt: app?.createdAt,
      };
    });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};
