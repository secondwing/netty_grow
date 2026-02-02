const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'KRW'
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'cancelled', 'refunded'],
        default: 'completed'
    },
    method: {
        type: String,
        default: 'card' // card, transfer, etc.
    },
    description: {
        type: String,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);
