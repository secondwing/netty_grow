const express = require('express');
const router = express.Router();
const { auth, verifyAdmin } = require('../middleware/auth');
const User = require('../models/User');
const GrowthPlan = require('../models/GrowthPlan');
const MonthlyLog = require('../models/MonthlyLog');
const Payment = require('../models/Payment');

// @route   GET api/admin/dashboard
// @desc    Get dashboard stats
// @access  Private/Admin
router.get('/dashboard', auth, verifyAdmin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const planCount = await GrowthPlan.countDocuments();

        // Count logs created this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const logCount = await MonthlyLog.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        // Daily Active Users (DAU) - approximation based on recent login/activity if tracked
        // For now, we'll just return total counts

        res.json({
            userCount,
            planCount,
            logCount,
            // Add more stats as needed
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', auth, verifyAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password') // Exclude password
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', auth, verifyAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        const validRoles = ['free', 'pro', 'ultra', 'admin'];

        if (!validRoles.includes(role)) {
            return res.status(400).json({ msg: 'Invalid role specified' });
        }

        // Prevent self-role text change
        if (req.user.id === req.params.id) {
            return res.status(403).json({ msg: 'Cannot change your own role' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { role } },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/admin/payments
// @desc    Get all payments
// @access  Private/Admin
router.get('/payments', auth, verifyAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const payments = await Payment.find()
            .populate('user', 'name username email')
            .sort({ paymentDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Payment.countDocuments();

        res.json({
            payments,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPayments: total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/payments
// @desc    Create a payment manually
// @access  Private/Admin
router.post('/payments', auth, verifyAdmin, async (req, res) => {
    try {
        const { user, amount, description, method, paymentDate } = req.body;

        if (!user || !amount || !description) {
            return res.status(400).json({ msg: 'Please provide user, amount, and description' });
        }

        const newPayment = new Payment({
            user,
            amount,
            description,
            method: method || 'card', // default to card if not specified
            status: 'completed', // Admin manual entry is assumed to be completed
            paymentDate: paymentDate || Date.now()
        });

        const payment = await newPayment.save();

        // Populate user details for the response
        await payment.populate('user', 'name username');

        res.json(payment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
