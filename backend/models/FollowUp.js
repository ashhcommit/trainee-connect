const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  traineeId: { type: String, required: true },
  milestone: { type: String, enum: ['30-day', '90-day', '180-day'], required: true },
  title: { type: String, required: true },
  dueOn: { type: Date, required: true },
  completedOn: { type: Date, default: null },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  stillWithEmployer: { type: Boolean, default: null },
  currentStatus: { type: String, default: null },
  salary: { type: Number, default: null },
  jobRelevant: { type: String, default: null },
  feedback: { type: String, default: null },
  reasonForLeaving: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('FollowUp', followUpSchema);
