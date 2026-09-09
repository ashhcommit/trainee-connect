const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  verificationId: { type: String, required: true, unique: true },
  outcomeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outcome', required: true },
  traineeId: { type: String, required: true },
  companyName: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  verificationNotes: { type: String, default: '' },
  rejectionReason: { type: String, default: '' },
  verifiedBy: { type: String, default: null },
  verifiedOn: { type: Date, default: null },
  employeeId: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Verification', verificationSchema);
