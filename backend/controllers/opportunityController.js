const Opportunity = require("../models/Opportunity");
const User = require("../models/User");
const NGOProfile = require("../models/NGOProfile");
const Notification = require("../models/Notification");
const { validationResult } = require("express-validator");
const { emitToUser } = require("../config/socket");
const VolunteerProfile = require("../models/VolunteerProfile");

exports.list = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("ngoId", "name")
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
    const opp = await Opportunity.findById(req.params.id)
      .populate("ngoId", "name")
      .lean();
    if (!opp) return res.status(404).json({ message: "Opportunity not found" });
    res.json({ ...opp, ngoName: opp.ngoId?.name });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    const { title, description, requiredSkills, duration, location } = req.body;
    const opportunity = await Opportunity.create({
      ngoId: req.user._id,
      title,
      description: description || "",
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : [requiredSkills].filter(Boolean),
      duration: duration || "",
      location: location || "",
    });
    const populated = await Opportunity.findById(opportunity._id)
      .populate("ngoId", "name")
      .lean();
    res.status(201).json({ ...populated, ngoName: populated.ngoId?.name });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const opp = await Opportunity.findOne({
      _id: req.params.id,
      ngoId: req.user._id,
    });
    if (!opp) return res.status(404).json({ message: "Opportunity not found" });
    const { title, description, requiredSkills, duration, location } = req.body;
    if (title !== undefined) opp.title = title;
    if (description !== undefined) opp.description = description;
    if (requiredSkills !== undefined)
      opp.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : [requiredSkills].filter(Boolean);
    if (duration !== undefined) opp.duration = duration;
    if (location !== undefined) opp.location = location;
    await opp.save();
    const populated = await Opportunity.findById(opp._id)
      .populate("ngoId", "name")
      .lean();
    res.json({ ...populated, ngoName: populated.ngoId?.name });
  } catch (err) {
    next(err);
  }
};

exports.apply = async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: "Opportunity not found" });
    const already = opp.applicants.some(
      (a) =>
        a.volunteerId && a.volunteerId.toString() === req.user._id.toString(),
    );
    if (already)
      return res.status(400).json({ message: "Already applied to this event" });
    opp.applicants.push({ volunteerId: req.user._id, status: "Pending" });
    await opp.save();
    res
      .status(201)
      .json({ message: "Application submitted", opportunityId: opp._id });
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }
    const { status } = req.body;

    // Populate ngoId to get the NGO's actual name for the personalized notification
    const opp = await Opportunity.findOne({
      _id: req.params.oppId,
      ngoId: req.user._id,
    }).populate("ngoId", "name");

    if (!opp) return res.status(404).json({ message: "Opportunity not found" });

    const applicant = opp.applicants.id(req.params.applicantId);
    if (!applicant)
      return res.status(404).json({ message: "Application not found" });

    // Update and save status
    applicant.status = status;
    await opp.save();

    // Construct the personalized notification message
    const ngoName = opp.ngoId?.name || "An NGO";
    const message =
      status === "Accepted"
        ? `Congratulations! ${ngoName} has accepted your application for "${opp.title}".`
        : `${ngoName} has updated your application status for "${opp.title}" to ${status}.`;

    const notification = await Notification.create({
      recipientId: applicant.volunteerId,
      userId: applicant.volunteerId, // Including both to cover different schema definitions
      message,
      relatedOpportunityId: opp._id,
      relatedNgoId: req.user._id,
      isRead: false,
    });

    const payload = notification.toObject
      ? notification.toObject()
      : notification;
    emitToUser(applicant.volunteerId.toString(), "notification", payload);

    res.json({
      message: `Application ${status.toLowerCase()}`,
      applicant: applicant.toObject(),
    });
  } catch (err) {
    next(err);
  }
};

exports.getApplicants = async (req, res, next) => {
  try {
    const opp = await Opportunity.findOne({
      _id: req.params.id,
      ngoId: req.user._id,
    })
      .populate("applicants.volunteerId", "name email")
      .lean();
    if (!opp) return res.status(404).json({ message: "Opportunity not found" });
    res.json(opp.applicants || []);
  } catch (err) {
    next(err);
  }
};

exports.getRecommendedVolunteers = async (req, res, next) => {
  try {
    // ── 1. Verify the opportunity exists and belongs to this NGO ──────────────
    const opp = await Opportunity.findOne({
      _id: req.params.id,
      ngoId: req.user._id,
    }).lean();

    if (!opp) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (!opp.requiredSkills || opp.requiredSkills.length === 0) {
      return res.json([]); // Nothing to match against
    }

    // ── 2. Fetch all volunteer profiles that have skills ──────────────────────
    const profiles = await VolunteerProfile.find({
      skills: { $exists: true, $not: { $size: 0 } },
    })
      .populate("userId", "name email") // pull name + email from User
      .lean();

    if (profiles.length === 0) {
      return res.json([]);
    }

    // Build the payload the ML service expects:
    // { requiredSkills: string[], volunteers: { id: string, skills: string[] }[] }
    const volunteersPayload = profiles.map((p) => ({
      id: p._id.toString(), // VolunteerProfile _id used as the ML key
      skills: p.skills,
    }));

    // ── 3. Call the ML microservice ───────────────────────────────────────────
    const ML_URL = process.env.ML_API_URL || "http://localhost:8000";

    console.log("[DEBUG] ML_URL:", ML_URL);
    console.log("[DEBUG] requiredSkills:", opp.requiredSkills);
    console.log("[DEBUG] volunteers count:", volunteersPayload.length);

    const mlResponse = await fetch(`${ML_URL}/recommend/volunteers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requiredSkills: opp.requiredSkills,
        volunteers: volunteersPayload,
      }),
    });

    if (!mlResponse.ok) {
      console.error(
        "[ML Service Error]",
        mlResponse.status,
        mlResponse.statusText,
      );
      return res
        .status(502)
        .json({ message: "ML service unavailable. Please try again later." });
    }

    const mlResults = await mlResponse.json(); // [{ id, matchScore }, ...]

    // ── 4. Merge scores back onto profile data ────────────────────────────────
    // Build a lookup map from profileId → matchScore for O(1) access
    const scoreMap = {};
    for (const { id, matchScore } of mlResults) {
      scoreMap[id] = matchScore;
    }

    const enriched = profiles
      .filter((p) => scoreMap[p._id.toString()] !== undefined)
      .map((p) => ({
        profileId: p._id,
        volunteerId: p.userId?._id,
        name: p.userId?.name || "Unknown",
        email: p.userId?.email || "",
        skills: p.skills,
        bio: p.bio || "",
        location: p.location || "",
        availability: p.availability || "",
        matchScore: scoreMap[p._id.toString()],
      }));

    // Sort descending by matchScore (ML service already sorts, but we re-sort
    // after the merge to be safe)
    enriched.sort((a, b) => b.matchScore - a.matchScore);

    // ── 5. Return ─────────────────────────────────────────────────────────────
    res.json(enriched);
  } catch (err) {
    // fetch() throws on network failure (no response at all)
    console.error("[ML Service Error]", err.message);
    return res
      .status(502)
      .json({ message: "ML service unavailable. Please try again later." });
  }
};
