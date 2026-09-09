const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  supabaseUserId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['citizen', 'trainee', 'employer', 'admin'],
    default: 'citizen'
  },
  adminRole: {
    type: String,
    enum: ['superAdmin', 'stateAdmin', 'districtAdmin', 'programmeAdmin'],
    default: null
  },
  state: {
    type: String,
    default: null
  },
  district: {
    type: String,
    default: null
  },
  scopeTarget: {
    type: String,
    default: null
  },
  companyName: {
    type: String,
    default: null
  },
  companyId: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
