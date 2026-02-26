const express = require('express');
const router = express.Router();
const ProApplication = require('../models/ProApplication');
const { auth } = require('../middleware/auth');

// @route   POST api/application
// @desc    Create a new application
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { paymentType, paymentStatus, communityParticipation, reason } = req.body;

        const newApplication = new ProApplication({
            user: req.user.id,
            paymentType,
            paymentStatus,
            communityParticipation,
            reason
        });

        const application = await newApplication.save();
        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/application
// @desc    Get current user's applications
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const applications = await ProApplication.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/application/all
// @desc    Get all applications (Admin only)
// @access  Private (Needs Admin Check ideally, but using auth for now, client side will protect or we can add admin middleware later)
// TODO: Add real admin middleware
router.get('/all', auth, async (req, res) => {
    try {
        // ideally check if req.user.isAdmin
        const applications = await ProApplication.find().populate('user', ['username', 'name', 'email']).sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
