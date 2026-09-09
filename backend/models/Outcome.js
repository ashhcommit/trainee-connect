const mongoose = require('mongoose');

const outcomeSchema = new mongoose.Schema({
  traineeId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employmentStatus: { type: String, required: true },
  employer: { type: String, default: 'None' },
  jobRole: { type: String, default: 'None' },
  salary: { type: Number, default: 0 },
  currentSalary: { type: Number, default: 0 },
  joinedOn: { type: Date },
  location: { type: String },
  skillsUsed: { type: String, default: '' },
  verificationStatus: { type: String, default: 'Not applicable' },
  submittedOn: { type: Date, default: Date.now },
  unemploymentReason: { type: String, default: '' },
  jobRelevance: { type: String, default: 'High' },
  flagged: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Outcome', outcomeSchema);
