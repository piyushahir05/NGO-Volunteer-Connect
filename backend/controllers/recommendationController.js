const VolunteerProfile = require('../models/VolunteerProfile');
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const { computeCosineSimilarity } = require('../utils/similarity');

// ---------------------------------------------------------------------------
// FEATURE 1 — Volunteer → Opportunity Recommendation
// GET /api/recommend/opportunities   (requires Volunteer auth)
// ---------------------------------------------------------------------------

/**
 * Returns the top-10 opportunities most relevant to the logged-in volunteer's
 * skill set, ranked by TF-IDF cosine similarity.
 *
 * The volunteer's skills array is joined into a single string and compared
 * against each opportunity's requiredSkills (also joined) combined with its
 * title and description for richer signal.
 */
exports.getRecommendedOpportunities = async (req, res, next) => {
  try {
    // 1. Fetch the logged-in volunteer's profile
    const profile = await VolunteerProfile.findOne({ userId: req.user._id }).lean();
    if (!profile) {
      return res.status(404).json({ message: 'Volunteer profile not found' });
    }

    // 2. Build a single text representation of the volunteer's skills/interests
    const volunteerText = [
      ...(profile.skills || []),
      profile.interests || '',
    ]
      .join(' ')
      .trim();

    // If the volunteer has no skills or interests yet, return an empty list
    if (!volunteerText) {
      return res.json([]);
    }

    // 3. Fetch all opportunities
    const opportunities = await Opportunity.find().populate('ngoId', 'name').lean();

    // 4. Compute similarity scores
    const scored = opportunities.map((opp) => {
      // Combine skills + title + description for a richer document vector
      const oppText = [
        ...(opp.requiredSkills || []),
        opp.title || '',
        opp.description || '',
      ]
        .join(' ')
        .trim();

      const matchScore = computeCosineSimilarity(volunteerText, oppText);
      return { opportunity: opp, matchScore };
    });

    // 5. Sort descending by score and return top 10
    const top10 = scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10)
      .map(({ opportunity, matchScore }) => ({
        opportunityId: opportunity._id,
        title: opportunity.title,
        ngoName: opportunity.ngoId?.name,
        location: opportunity.location,
        duration: opportunity.duration,
        requiredSkills: opportunity.requiredSkills,
        matchScore: parseFloat(matchScore.toFixed(4)),
      }));

    res.json(top10);
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// FEATURE 2 — NGO → Volunteer Recommendation
// GET /api/recommend/volunteers/:opportunityId   (requires NGO auth)
// ---------------------------------------------------------------------------

/**
 * Returns volunteers ranked by how well their skills match the required skills
 * of the given opportunity.
 *
 * Only the NGO that owns the opportunity may call this endpoint (enforced at
 * the route level via the `role` middleware).
 */
exports.getRecommendedVolunteers = async (req, res, next) => {
  try {
    // 1. Fetch the opportunity and verify it belongs to this NGO
    const opportunity = await Opportunity.findOne({
      _id: req.params.opportunityId,
      ngoId: req.user._id,
    }).lean();

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // 2. Build a text representation of the opportunity's required skills
    const oppText = (opportunity.requiredSkills || []).join(' ').trim();
    if (!oppText) {
      return res.json([]);
    }

    // 3. Fetch all volunteer profiles with their user details
    const profiles = await VolunteerProfile.find()
      .populate('userId', 'name email')
      .lean();

    // 4. Compute similarity scores
    const scored = profiles.map((profile) => {
      const volunteerText = [
        ...(profile.skills || []),
        profile.interests || '',
      ]
        .join(' ')
        .trim();

      const matchScore = computeCosineSimilarity(oppText, volunteerText);
      return { profile, matchScore };
    });

    // 5. Sort descending by score and return all ranked results
    const ranked = scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .map(({ profile, matchScore }) => ({
        volunteerId: profile.userId?._id,
        name: profile.userId?.name,
        email: profile.userId?.email,
        skills: profile.skills,
        location: profile.location,
        matchScore: parseFloat(matchScore.toFixed(4)),
      }));

    res.json(ranked);
  } catch (err) {
    next(err);
  }
};

// ---------------------------------------------------------------------------
// FEATURE 3 — Smart Opportunity Search Ranking
// GET /api/recommend/search?q=keyword   (public)
// ---------------------------------------------------------------------------

/**
 * Full-text search over opportunities ranked by TF-IDF cosine similarity.
 *
 * Each opportunity is represented by the concatenation of its title,
 * description, and required skills.  The search query is compared against
 * every document and results are returned in descending relevance order.
 */
exports.searchRankedOpportunities = async (req, res, next) => {
  try {
    const query = (req.query.q || '').trim();
    if (!query) {
      return res.status(400).json({ message: 'Query parameter "q" is required' });
    }

    // Fetch all opportunities
    const opportunities = await Opportunity.find().populate('ngoId', 'name').lean();

    // Score each opportunity against the search query
    const scored = opportunities.map((opp) => {
      const oppText = [
        opp.title || '',
        opp.description || '',
        ...(opp.requiredSkills || []),
      ]
        .join(' ')
        .trim();

      const matchScore = computeCosineSimilarity(query, oppText);
      return { opportunity: opp, matchScore };
    });

    // Sort by relevance and return (filter out zero-score results)
    const ranked = scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .filter(({ matchScore }) => matchScore > 0)
      .map(({ opportunity, matchScore }) => ({
        opportunityId: opportunity._id,
        title: opportunity.title,
        ngoName: opportunity.ngoId?.name,
        description: opportunity.description,
        requiredSkills: opportunity.requiredSkills,
        location: opportunity.location,
        duration: opportunity.duration,
        matchScore: parseFloat(matchScore.toFixed(4)),
      }));

    res.json(ranked);
  } catch (err) {
    next(err);
  }
};
