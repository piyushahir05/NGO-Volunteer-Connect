const mongoose = require('mongoose');

const volunteerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }], // Changed from String to Array of Strings
    availability: { type: String, default: '' },
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    gender: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VolunteerProfile', volunteerProfileSchema);