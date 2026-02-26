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

// @route   PUT api/application/:id/payment
// @desc    Update payment status (Admin)
// @access  Private
router.put('/:id/payment', auth, async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const validStatuses = ['paid', 'pending', 'free_event'];
        if (!validStatuses.includes(paymentStatus)) return res.status(400).json({ msg: 'Invalid payment status' });

        const app = await ProApplication.findByIdAndUpdate(req.params.id, { $set: { paymentStatus } }, { new: true });
        res.json(app);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/application/:id/participation
// @desc    Update community participation (Admin)
// @access  Private
router.put('/:id/participation', auth, async (req, res) => {
    try {
        const { communityParticipation } = req.body;
        const validStatuses = ['yes', 'no', 'later'];
        if (!validStatuses.includes(communityParticipation)) return res.status(400).json({ msg: 'Invalid participation status' });

        const app = await ProApplication.findByIdAndUpdate(req.params.id, { $set: { communityParticipation } }, { new: true });
        res.json(app);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/application/:id/status
// @desc    Update application overall status (Admin)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['submitted', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) return res.status(400).json({ msg: 'Invalid status' });

        const app = await ProApplication.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
        res.json(app);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/application/:id
// @desc    Delete an application (Admin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        await ProApplication.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Application deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
