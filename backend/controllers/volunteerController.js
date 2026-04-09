const VolunteerProfile = require('../models/VolunteerProfile');
const Opportunity = require('../models/Opportunity');
const Memory = require('../models/Memory');
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
    
    const { skills, interests, availability, location, bio, phone, gender } = req.body;
    
    let profile = await VolunteerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new VolunteerProfile({ userId: req.user._id });
    }
    
    // Update fields safely
    if (skills !== undefined) profile.skills = Array.isArray(skills) ? skills : [skills].filter(Boolean);
    if (interests !== undefined) profile.interests = Array.isArray(interests) ? interests : [interests].filter(Boolean);
    if (availability !== undefined) profile.availability = availability;
    if (location !== undefined) profile.location = location;
    if (bio !== undefined) profile.bio = bio;
    if (phone !== undefined) profile.phone = phone;
    if (gender !== undefined) profile.gender = gender;

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
        opportunityId: opp, 
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
      causesSupported: ngoSet.size,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

// --- Impact Journal / Memories Controllers ---

exports.getMemories = async (req, res, next) => {
  try {
    const memories = await Memory.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(memories);
  } catch (err) {
    next(err);
  }
};

exports.addMemory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { opportunityId, opportunityTitle, rating, text, date } = req.body;
    
    const newMemory = new Memory({
      userId: req.user._id,
      opportunityId,
      opportunityTitle,
      rating,
      text,
      date: date || Date.now()
    });
    
    await newMemory.save();
    res.status(201).json(newMemory);
  } catch (err) {
    next(err);
  }
};