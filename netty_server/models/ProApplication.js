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
        enum: ['paid', 'pending'], // paid: 납부완료, pending: 아직 안함
        required: true
    },
    communityParticipation: {
        type: String,
        enum: ['yes', 'no'], // yes: 참여, no: 불참
        required: true
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
