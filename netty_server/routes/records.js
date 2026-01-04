const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

const auth = require('../middleware/auth');

// GET all records for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const records = await Record.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new record (Simple Text)
router.post('/', auth, async (req, res) => {
    const { content, date } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    const record = new Record({
        userId: req.user.id,
        content: content,
        date: date || Date.now()
    });

    try {
        const newRecord = await record.save();
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update record
router.put('/:id', auth, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const updatedRecord = await Record.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { content },
            { new: true }
        );

        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.json(updatedRecord);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE record
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedRecord = await Record.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json({ message: 'Record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
