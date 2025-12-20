const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

// GET all records
router.get('/', async (req, res) => {
    try {
        const records = await Record.find().sort({ createdAt: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new record (Simple Text)
router.post('/', async (req, res) => {
    const { content, date } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    const record = new Record({
        userId: 'mock-user', // TODO: Use actual logged-in user ID
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
router.put('/:id', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const updatedRecord = await Record.findByIdAndUpdate(
            req.params.id,
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
router.delete('/:id', async (req, res) => {
    try {
        const deletedRecord = await Record.findByIdAndDelete(req.params.id);
        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json({ message: 'Record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
