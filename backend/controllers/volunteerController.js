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

exports.getDashboardStats = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({
      'applicants.volunteerId': req.user._id,
    })
      .populate('ngoId', 'name')
      .lean();

    let totalApplications = 0;
    let accepted = 0;
    let pending = 0;
    let rejected = 0;
    const ngoSet = new Set();

    const applications = opportunities.map((opp) => {
      const app = opp.applicants.find(
        (a) => a.volunteerId && a.volunteerId.toString() === req.user._id.toString()
      );
      const status = app?.status || 'Pending';
      totalApplications++;
      if (status === 'Accepted') accepted++;
      else if (status === 'Pending') pending++;
      else if (status === 'Rejected') rejected++;
      if (opp.ngoId?._id) ngoSet.add(opp.ngoId._id.toString());
      return {
        _id: opp._id,
        title: opp.title,
        ngoName: opp.ngoId?.name,
        status,
        appliedAt: app?.createdAt,
      };
    });

    res.json({
      userName: req.user.name,
      totalApplications,
      accepted,
      pending,
      rejected,
      eventsAttended: accepted,
      causesSupported: ngoSet.size,
      applications,
    });
  } catch (err) {
    next(err);
  }
};
