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
    activityLogs: [{
        activityId: mongoose.Schema.Types.ObjectId, // Refers to activity in GrowthPlan
        log: { type: String, default: '' }
    }],
    itemAnalyses: [{
        itemId: mongoose.Schema.Types.ObjectId, // Refers to item in GrowthPlan
        strength: { type: String, default: '' },
        weakness: { type: String, default: '' },
        supplement: { type: String, default: '' }
    }],
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
