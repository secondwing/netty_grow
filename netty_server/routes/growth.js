const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GrowthPlan = require('../models/GrowthPlan');
const MonthlyLog = require('../models/MonthlyLog');

// Get Growth Plan for a specific year
router.get('/plan/:year', auth, async (req, res) => {
    try {
        const { year } = req.params;
        let plan = await GrowthPlan.findOne({ userId: req.user.id, year });

        if (!plan) {
            // Create a new empty plan if not exists
            plan = new GrowthPlan({
                userId: req.user.id,
                year,
                desiredSelf: ['', '', ''],
                goals: [
                    { goal: '', action: '', motivation: '' },
                    { goal: '', action: '', motivation: '' },
                    { goal: '', action: '', motivation: '' }
                ]
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
        const { desiredSelf, goals, result, reflection } = req.body;

        const plan = await GrowthPlan.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { desiredSelf, goals, result, reflection },
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
                tasks: [],
                analysis: { positive: '', negative: '', improvement: '' }
            });
            await log.save();
        }

        res.json(log);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update Monthly Log
router.put('/log/:id', auth, async (req, res) => {
    try {
        const { tasks, analysis } = req.body;

        const log = await MonthlyLog.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { tasks, analysis },
            { new: true }
        );

        if (!log) return res.status(404).json({ message: 'Log not found' });

        res.json(log);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
