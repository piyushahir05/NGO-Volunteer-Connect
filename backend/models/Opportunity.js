const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema(
  {
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  { _id: true }
);

const opportunitySchema = new mongoose.Schema(
  {
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    requiredSkills: [{ type: String, trim: true }],
    duration: { type: String, default: '' },
    location: { type: String, default: '' },
    applicants: [applicantSchema],
  },
  { timestamps: true }
);

opportunitySchema.index({ ngoId: 1 });
opportunitySchema.index({ 'applicants.volunteerId': 1 });

module.exports = mongoose.model('Opportunity', opportunitySchema);
