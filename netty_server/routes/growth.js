const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const GrowthPlan = require('../models/GrowthPlan');
const MonthlyLog = require('../models/MonthlyLog');

// Get Growth Plan for a specific year
router.get('/plan/:year', auth, async (req, res) => {
    try {
        const { year } = req.params;
        let plan = await GrowthPlan.findOne({ userId: req.user.id, year });

        if (!plan) {
            // Create a new empty plan if not exists
            // Default: 3 items, each with 3 activities
            const defaultItems = Array(3).fill(null).map(() => ({
                desiredSelf: '',
                goal: '',
                motivation: '',
                activities: Array(3).fill(null).map(() => ({ content: '', outcome: '' }))
            }));

            // Default: 12 months for yearly overview
            const defaultOverview = Array.from({ length: 12 }, (_, i) => ({
                month: i + 1,
                content: '',
                summary: ''
            }));

            plan = new GrowthPlan({
                userId: req.user.id,
                year,
                items: defaultItems,
                yearlyOverview: defaultOverview,
                reflection: { summary: '', detail: '' }
            });
            await plan.save();
        }

        res.json(plan);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Growth Plan
router.put('/plan/:id', auth, async (req, res) => {
    try {
        const { items, yearlyOverview, reflection } = req.body;

        const plan = await GrowthPlan.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { items, yearlyOverview, reflection },
            { new: true }
        );

        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        res.json(plan);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get Monthly Log
router.get('/log/:year/:month', auth, async (req, res) => {
    try {
        const { year, month } = req.params;

        // Ensure plan exists first
        let plan = await GrowthPlan.findOne({ userId: req.user.id, year });
        if (!plan) {
            return res.status(404).json({ message: 'Yearly plan not found. Please create a plan first.' });
        }

        let log = await MonthlyLog.findOne({ userId: req.user.id, planId: plan._id, month });

        if (!log) {
            // Create empty log
            log = new MonthlyLog({
                userId: req.user.id,
                planId: plan._id,
                year,
                month,
                activityLogs: [],
                itemAnalyses: []
            });
            await log.save();
        }

        res.json(log);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get All Monthly Logs for a Year (for PDF Report)
router.get('/logs/:year', auth, async (req, res) => {
    try {
        const { year } = req.params;
        const logs = await MonthlyLog.find({ userId: req.user.id, year }).sort({ month: 1 });
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Update Monthly Log
router.put('/log/:id', auth, async (req, res) => {
    try {
        const { activityLogs, itemAnalyses } = req.body;

        const log = await MonthlyLog.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { activityLogs, itemAnalyses },
            { new: true }
        );

        if (!log) return res.status(404).json({ message: 'Log not found' });

        res.json(log);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

const { verifyAdmin } = require('../middleware/auth');

// --- Admin Endpoints for Growth Data ---

// Admin: Get specific user's Growth Plan
router.get('/admin/plan/:userId/:year', [auth, verifyAdmin], async (req, res) => {
    try {
        const { userId, year } = req.params;
        const plan = await GrowthPlan.findOne({ userId, year });
        if (!plan) return res.status(404).json({ message: 'Plan not found for this user.' });
        res.json(plan);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin: Get specific user's Monthly Log for a month
router.get('/admin/log/:userId/:year/:month', [auth, verifyAdmin], async (req, res) => {
    try {
        const { userId, year, month } = req.params;
        const plan = await GrowthPlan.findOne({ userId, year });
        if (!plan) return res.status(404).json({ message: 'Plan not found.' });

        const log = await MonthlyLog.findOne({ userId, planId: plan._id, month });
        // If no log exists yet, admin might want to see empty? 
        // Or maybe just 404. Let's return 404 or empty object if expected to be viewed.
        // Usually admin reviews *existing* logs.
        if (!log) return res.status(404).json({ message: 'Log not found.' });

        res.json(log);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin: Get all Monthly Logs for specific user/year
router.get('/admin/logs/:userId/:year', [auth, verifyAdmin], async (req, res) => {
    try {
        const { userId, year } = req.params;
        const logs = await MonthlyLog.find({ userId, year }).sort({ month: 1 });
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin Feedback for Growth Plan
router.put('/plan/:id/feedback', [auth, verifyAdmin], async (req, res) => {
    try {
        const { feedback } = req.body; // { content, author }

        const plan = await GrowthPlan.findByIdAndUpdate(
            req.params.id,
            {
                adminFeedback: {
                    ...feedback,
                    updatedAt: new Date()
                }
            },
            { new: true }
        );

        if (!plan) return res.status(404).json({ message: 'Plan not found' });
        res.json(plan);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin Feedback for Monthly Log (Activity or Item)
router.put('/log/:id/feedback', [auth, verifyAdmin], async (req, res) => {
    try {
        const { targetType, targetId, feedback } = req.body;
        // targetType: 'activity' | 'item'
        // targetId: activityId | itemId
        // feedback: { content, author }

        const feedbackData = {
            ...feedback,
            updatedAt: new Date()
        };

        let updateQuery = {};
        let filter = { _id: req.params.id };

        if (targetType === 'activity') {
            // Find logic to update specific array element
            filter['activityLogs.activityId'] = targetId;
            updateQuery = {
                $set: { 'activityLogs.$.adminFeedback': feedbackData }
            };
        } else if (targetType === 'item') {
            filter['itemAnalyses.itemId'] = targetId;
            updateQuery = {
                $set: { 'itemAnalyses.$.adminFeedback': feedbackData }
            };
        } else {
            return res.status(400).json({ message: 'Invalid target type' });
        }

        const log = await MonthlyLog.findOneAndUpdate(filter, updateQuery, { new: true });

        if (!log) return res.status(404).json({ message: 'Log or target item not found' });
        res.json(log);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
