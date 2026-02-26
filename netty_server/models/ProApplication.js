const mongoose = require('mongoose');

const ProApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentType: {
        type: String,
        enum: ['1month', '6months'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'free_event'], // paid: 납부완료, pending: 아직 안함, free_event: 무료혜택
        required: true
    },
    communityParticipation: {
        type: String,
        enum: ['yes', 'no', 'later'], // yes: 참여, no: 불참, later: 고민해 보겠습니다
        required: true
    },
    reason: {
        type: String, // from checkboxes: 혜택1, 혜택2...
        required: false
    },
    status: {
        type: String,
        enum: ['submitted', 'approved', 'rejected'],
        default: 'submitted'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ProApplication', ProApplicationSchema);
