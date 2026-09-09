const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Trainee = require('../models/Trainee');
const { requireAuth } = require('../middleware/auth');

// Helper to generate unique IDs
const generateId = (prefix, count) => `${prefix}-${1000 + count}`;

router.post('/register', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    const supabaseUserId = decoded.sub;

    const { name, email, phone, district, state, consent, role } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ supabaseUserId });
    if (user) {
      return res.status(400).json({ error: 'User already registered in DB' });
    }

    const userCount = await User.countDocuments();
    const newUserId = generateId('USR', userCount + 1);

    user = new User({
      supabaseUserId,
      userId: newUserId,
      name,
      email,
      role: role || 'citizen' // default to citizen or trainee
    });

    await user.save();

    if (user.role === 'citizen' || user.role === 'trainee') {
      const traineeCount = await Trainee.countDocuments();
      const traineeId = generateId('TRN', traineeCount + 1);
      const trainee = new Trainee({
        userId: user._id,
        traineeId,
        name,
        email,
        phone: phone || '9876500000',
        district: district || 'Kolkata',
        state: state || 'West Bengal',
        consent: Boolean(consent)
      });
      await trainee.save();
    }

    res.status(201).json({ success: true, user });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

router.post('/login', requireAuth, async (req, res) => {
  // If requireAuth passes, req.user is set
  const user = req.user;
  
  if (user.role === 'citizen' || user.role === 'trainee') {
    const trainee = await Trainee.findOne({ userId: user._id });
    return res.json({ success: true, user: { ...user.toObject(), traineeId: trainee?.traineeId } });
  }
  
  res.json({ success: true, user });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = req.user;
  if (user.role === 'citizen' || user.role === 'trainee') {
    const trainee = await Trainee.findOne({ userId: user._id });
    return res.json({ success: true, user: { ...user.toObject(), traineeId: trainee?.traineeId } });
  }
  res.json({ success: true, user });
});

module.exports = router;
