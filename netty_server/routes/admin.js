const express = require('express');
const router = express.Router();
const { auth, verifyAdmin } = require('../middleware/auth');
const User = require('../models/User');
const GrowthPlan = require('../models/GrowthPlan');
const MonthlyLog = require('../models/MonthlyLog');

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

module.exports = router;
