const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // TODO: Link to User model ObjectId
    content: { type: String, required: true }, // 오늘의 기록 (Text Only)
    date: { type: Date, default: Date.now }, // Record date
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', RecordSchema);
