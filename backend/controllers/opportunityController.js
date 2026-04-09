const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const NGOProfile = require('../models/NGOProfile');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');
const { emitToUser } = require('../config/socket');

exports.list = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find()
      .populate('ngoId', 'name')
      .sort({ createdAt: -1 })
      .lean();
    const withNgoName = opportunities.map((o) => ({
      ...o,
      ngoName: o.ngoId?.name,
    }));
    res.json(withNgoName);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id).populate('ngoId', 'name').lean();
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    res.json({ ...opp, ngoName: opp.ngoId?.name });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { title, description, requiredSkills, duration, location } = req.body;
    const opportunity = await Opportunity.create({
      ngoId: req.user._id,
      title,
      description: description || '',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills].filter(Boolean),
      duration: duration || '',
      location: location || '',
    });
    const populated = await Opportunity.findById(opportunity._id).populate('ngoId', 'name').lean();
    res.status(201).json({ ...populated, ngoName: populated.ngoId?.name });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const opp = await Opportunity.findOne({ _id: req.params.id, ngoId: req.user._id });
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    const { title, description, requiredSkills, duration, location } = req.body;
    if (title !== undefined) opp.title = title;
    if (description !== undefined) opp.description = description;
    if (requiredSkills !== undefined) opp.requiredSkills = Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills].filter(Boolean);
    if (duration !== undefined) opp.duration = duration;
    if (location !== undefined) opp.location = location;
    await opp.save();
    const populated = await Opportunity.findById(opp._id).populate('ngoId', 'name').lean();
    res.json({ ...populated, ngoName: populated.ngoId?.name });
  } catch (err) {
    next(err);
  }
};

exports.apply = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    const already = opp.applicants.some(
      (a) => a.volunteerId && a.volunteerId.toString() === req.user._id.toString()
    );
    if (already) return res.status(400).json({ message: 'Already applied to this event' });
    opp.applicants.push({ volunteerId: req.user._id, status: 'Pending' });
    await opp.save();
    res.status(201).json({ message: 'Application submitted', opportunityId: opp._id });
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { status } = req.body;
    
    // Populate ngoId to get the NGO's actual name for the personalized notification
    const opp = await Opportunity.findOne({ _id: req.params.oppId, ngoId: req.user._id })
      .populate('ngoId', 'name');
      
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    
    const applicant = opp.applicants.id(req.params.applicantId);
    if (!applicant) return res.status(404).json({ message: 'Application not found' });
    
    // Update and save status
    applicant.status = status;
    await opp.save();

    // Construct the personalized notification message
    const ngoName = opp.ngoId?.name || 'An NGO';
    const message =
      status === 'Accepted'
        ? `Congratulations! ${ngoName} has accepted your application for "${opp.title}".`
        : `${ngoName} has updated your application status for "${opp.title}" to ${status}.`;
        
    const notification = await Notification.create({
      recipientId: applicant.volunteerId,
      userId: applicant.volunteerId, // Including both to cover different schema definitions
      message,
      relatedOpportunityId: opp._id,
      relatedNgoId: req.user._id,
      isRead: false
    });
    
    const payload = notification.toObject ? notification.toObject() : notification;
    emitToUser(applicant.volunteerId.toString(), 'notification', payload);
    
    res.json({ message: `Application ${status.toLowerCase()}`, applicant: applicant.toObject() });
  } catch (err) {
    next(err);
  }
};

exports.getApplicants = async (req, res, next) => {
  try {
    const opp = await Opportunity.findOne({ _id: req.params.id, ngoId: req.user._id })
      .populate('applicants.volunteerId', 'name email')
      .lean();
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opp.applicants || []);
  } catch (err) {
    next(err);
  }
};