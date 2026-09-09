const mongoose = require('mongoose');

const traineeSchema = new mongoose.Schema({
  traineeId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  consent: { type: Boolean, required: true },
  course: { type: String },
  provider: { type: String },
  trainingStatus: { type: String, default: 'Completed' },
  certificationStatus: { type: String, default: 'Certified' },
  certificateId: { type: String },
  completedOn: { type: Date },
  programme: { type: String },
  profileCompletion: { type: Number, default: 80 }
}, { timestamps: true });

module.exports = mongoose.model('Trainee', traineeSchema);
