const express = require('express');
const router = express.Router();
const GrowthStage = require('../models/GrowthStage');
const { auth, verifyAdmin } = require('../middleware/auth');

// @route   GET /api/growth-stages
// @desc    Get all growth stages
// @access  Public (or semi-private, needed for MyPage)
router.get('/', async (req, res) => {
    try {
        // Sort by minScore to ensure order
        const stages = await GrowthStage.find().sort({ minScore: 1 });
        res.json(stages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/growth-stages/:id
// @desc    Update a growth stage
// @access  Admin only
router.put('/:id', auth, verifyAdmin, async (req, res) => {
    try {
        const { name, description, imageUrl, minScore, maxScore } = req.body;

        // Find by stageId (e.g., 'growth_01') or _id. 
        // Let's assume URL param is stageId for clarity, or we can look up by _id.
        // Given the unique stageId, let's use that or `_id`. 
        // To be safe, let's try to find by `stageId` first, if not found, try `_id`.

        let stage = await GrowthStage.findOne({ stageId: req.params.id });

        if (!stage) {
            // Try by _id if valid ObjectId
            if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                stage = await GrowthStage.findById(req.params.id);
            }
        }

        if (!stage) {
            return res.status(404).json({ msg: 'Growth stage not found' });
        }

        // Update fields
        if (name) stage.name = name;
        if (description) stage.description = description;
        if (imageUrl) stage.imageUrl = imageUrl;
        if (minScore !== undefined) stage.minScore = minScore;
        if (maxScore !== undefined) stage.maxScore = maxScore;

        await stage.save();
        res.json(stage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
