const express = require('express');
const router = express.Router();
const Trainee = require('../models/Trainee');
const Outcome = require('../models/Outcome');
const FollowUp = require('../models/FollowUp');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/data', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const { filters = {} } = req.body;
    const { adminRole, scopeTarget, state, district } = req.user;

    // Build trainee filter query
    let query = {};
    if (adminRole === 'stateAdmin' && state) {
      query.state = state;
    } else if (adminRole === 'districtAdmin' && district) {
      query.district = district;
    } else if (adminRole === 'programmeAdmin' && scopeTarget) {
      query.programme = new RegExp(scopeTarget, 'i');
    }

    if (filters.course && filters.course !== 'all') query.course = filters.course;
    if (filters.provider && filters.provider !== 'all') query.provider = filters.provider;
    if (filters.district && filters.district !== 'all') query.district = filters.district;

    const trainees = await Trainee.find(query).lean();
    const traineeIds = trainees.map(t => t.traineeId);

    // Build outcome filter query
    let outcomeQuery = { traineeId: { $in: traineeIds } };
    if (filters.employmentStatus && filters.employmentStatus !== 'all') outcomeQuery.employmentStatus = filters.employmentStatus;
    if (filters.verificationStatus && filters.verificationStatus !== 'all') outcomeQuery.verificationStatus = filters.verificationStatus;
    if (filters.flaggedOnly) outcomeQuery.flagged = true;

    const outcomes = await Outcome.find(outcomeQuery).lean();
    
    // Quick mock response for analytics just mirroring the mock API structure, but driven from real MongoDB collections.
    res.json({
      success: true,
      data: {
        totalTrainees: trainees.length,
        outcomesCount: outcomes.length,
        // (Add more specific aggregations as required by frontend)
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
