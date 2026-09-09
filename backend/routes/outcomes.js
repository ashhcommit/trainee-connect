const express = require('express');
const router = express.Router();
const Outcome = require('../models/Outcome');
const FollowUp = require('../models/FollowUp');
const Trainee = require('../models/Trainee');
const { requireAuth } = require('../middleware/auth');

// Get outcome for trainee
router.get('/', requireAuth, async (req, res) => {
  try {
    const trainee = await Trainee.findOne({ userId: req.user._id });
    if (!trainee) return res.status(404).json({ error: 'Trainee not found' });

    let outcome = await Outcome.findOne({ traineeId: trainee.traineeId });
    if (!outcome) {
      // Return a default if not found
      outcome = {
        employmentStatus: 'Not yet reported',
        employer: 'None',
        jobRole: 'None',
        verificationStatus: 'Not applicable'
      };
    }
    res.json(outcome);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit outcome
router.post('/', requireAuth, async (req, res) => {
  try {
    const trainee = await Trainee.findOne({ userId: req.user._id });
    if (!trainee) return res.status(404).json({ error: 'Trainee not found' });

    const isEmployed = req.body.employmentStatus === 'Employed' || req.body.employmentStatus === 'Apprentice';
    const isSelfEmployed = req.body.employmentStatus === 'Self-employed';

    const verificationStatus = isEmployed ? 'Pending' : 'Not applicable';

    const outcomeData = {
      traineeId: trainee.traineeId,
      userId: req.user._id,
      employmentStatus: req.body.employmentStatus,
      employer: isEmployed ? req.body.employer : (isSelfEmployed ? `Self-employed` : 'None'),
      jobRole: req.body.jobRole || 'None',
      salary: Number(req.body.salary) || 0,
      currentSalary: Number(req.body.salary) || 0,
      joinedOn: req.body.joinedOn || new Date(),
      location: req.body.location || trainee.location,
      skillsUsed: req.body.skillsUsed || '',
      verificationStatus,
      unemploymentReason: req.body.unemploymentReason || '',
      jobRelevance: req.body.jobRelevance || 'High'
    };

    const outcome = await Outcome.findOneAndUpdate(
      { traineeId: trainee.traineeId },
      { $set: outcomeData },
      { new: true, upsert: true }
    );

    res.json({ success: true, outcome });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Follow-ups
router.get('/followups', requireAuth, async (req, res) => {
  try {
    const trainee = await Trainee.findOne({ userId: req.user._id });
    if (!trainee) return res.status(404).json({ error: 'Trainee not found' });

    const followUps = await FollowUp.find({ traineeId: trainee.traineeId });
    res.json(followUps);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/followups', requireAuth, async (req, res) => {
  try {
    const trainee = await Trainee.findOne({ userId: req.user._id });
    if (!trainee) return res.status(404).json({ error: 'Trainee not found' });

    const { milestone, stillWithEmployer, currentStatus, currentSalary, jobRelevant, reasonForLeaving, unemploymentReason, feedback } = req.body;

    const followUp = await FollowUp.findOneAndUpdate(
      { traineeId: trainee.traineeId, milestone },
      {
        $set: {
          completedOn: new Date(),
          status: 'Completed',
          stillWithEmployer: Boolean(stillWithEmployer),
          currentStatus: currentStatus || (stillWithEmployer ? 'Employed' : 'Unemployed'),
          salary: Number(currentSalary) || 0,
          jobRelevant: jobRelevant || 'Yes',
          feedback: feedback || reasonForLeaving || unemploymentReason || 'Follow-up submitted',
          reasonForLeaving: reasonForLeaving || null
        }
      },
      { new: true, upsert: true } // upsert just in case they don't exist yet
    );

    res.json({ success: true, followUp });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
