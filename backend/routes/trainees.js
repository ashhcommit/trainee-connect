const express = require('express');
const router = express.Router();
const Trainee = require('../models/Trainee');
const { requireAuth } = require('../middleware/auth');

router.get('/profile', requireAuth, async (req, res) => {
  try {
    let trainee;
    if (req.user.role === 'citizen' || req.user.role === 'trainee') {
      trainee = await Trainee.findOne({ userId: req.user._id });
    } else {
      return res.status(403).json({ error: 'Only trainees can view their profile here' });
    }

    if (!trainee) {
      return res.status(404).json({ error: 'Trainee profile not found' });
    }

    res.json(trainee);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'citizen' && req.user.role !== 'trainee') {
      return res.status(403).json({ error: 'Only trainees can edit their profile' });
    }

    const trainee = await Trainee.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!trainee) {
      return res.status(404).json({ error: 'Trainee profile not found' });
    }

    res.json({ success: true, profile: trainee });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
