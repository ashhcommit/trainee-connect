const express = require('express');
const router = express.Router();
const Outcome = require('../models/Outcome');
const Trainee = require('../models/Trainee');
const { requireAuth, requireRole } = require('../middleware/auth');

// Get verification requests for the employer's company
router.get('/verifications', requireAuth, requireRole(['employer']), async (req, res) => {
  try {
    const companyName = req.user.companyName;
    if (!companyName) {
      return res.status(400).json({ error: 'Employer has no company assigned' });
    }

    // Find outcomes where employer matches companyName
    const outcomes = await Outcome.find({
      employer: new RegExp('^' + companyName + '$', 'i'),
      employmentStatus: { $in: ['Employed', 'Apprentice'] }
    });

    const traineeIds = outcomes.map(o => o.traineeId);
    const trainees = await Trainee.find({ traineeId: { $in: traineeIds } });

    const requests = outcomes.map(outcome => {
      const trainee = trainees.find(t => t.traineeId === outcome.traineeId);
      return {
        id: `VER-${outcome.traineeId.replace('TRN-', '')}`,
        verificationId: `VER-${outcome.traineeId.replace('TRN-', '')}`,
        traineeId: outcome.traineeId,
        traineeName: trainee ? trainee.name : 'Unknown',
        email: trainee ? trainee.email : '',
        phone: trainee ? trainee.phone : '',
        reportedEmployer: outcome.employer,
        employer: outcome.employer,
        jobRole: outcome.jobRole,
        reportedSalary: outcome.salary,
        salary: outcome.salary,
        currentSalary: outcome.currentSalary,
        joiningDate: outcome.joinedOn,
        joinedOn: outcome.joinedOn,
        location: outcome.location,
        skillsUsed: outcome.skillsUsed,
        submittedDate: outcome.submittedOn,
        submittedOn: outcome.submittedOn,
        status: outcome.verificationStatus,
        verificationStatus: outcome.verificationStatus,
        verificationNotes: outcome.verificationNotes,
        rejectionReason: outcome.rejectionReason,
        course: trainee ? trainee.course : '',
        provider: trainee ? trainee.provider : ''
      };
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify
router.post('/verify', requireAuth, requireRole(['employer']), async (req, res) => {
  try {
    const { traineeId, notes, employeeId } = req.body;
    const companyName = req.user.companyName;

    const outcome = await Outcome.findOne({ traineeId, employer: new RegExp('^' + companyName + '$', 'i') });
    if (!outcome) return res.status(404).json({ error: 'Record not found or unauthorized' });

    outcome.verificationStatus = 'Verified';
    outcome.verificationNotes = notes || (employeeId ? `Verified against payroll. Employee ID: ${employeeId}` : `Verified by employer HR`);
    outcome.rejectionReason = '';
    outcome.flagged = false;
    await outcome.save();

    res.json({ success: true, outcome });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject
router.post('/reject', requireAuth, requireRole(['employer']), async (req, res) => {
  try {
    const { traineeId, reason, rejectionReason, remarks, notes } = req.body;
    const companyName = req.user.companyName;

    const outcome = await Outcome.findOne({ traineeId, employer: new RegExp('^' + companyName + '$', 'i') });
    if (!outcome) return res.status(404).json({ error: 'Record not found or unauthorized' });

    outcome.verificationStatus = 'Rejected';
    outcome.rejectionReason = reason || rejectionReason || 'Employment claim could not be verified by employer.';
    outcome.verificationNotes = `Employer remarks: ${remarks || notes || 'Claim rejected'}`;
    outcome.flagged = true;
    await outcome.save();

    res.json({ success: true, outcome });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
