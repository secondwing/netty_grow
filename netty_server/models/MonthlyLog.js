const mongoose = require('mongoose');

const monthlyLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GrowthPlan',
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    tasks: [{
        content: String,
        isCompleted: {
            type: Boolean,
            default: false
        },
        log: String // Activity log for this task
    }],
    analysis: {
        positive: { type: String, default: '' }, // Action Result (+)
        negative: { type: String, default: '' }, // Action Result (-)
        improvement: { type: String, default: '' } // Improvement Plan
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

monthlyLogSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

// Compound index to ensure one log per month per plan
monthlyLogSchema.index({ planId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyLog', monthlyLogSchema);
