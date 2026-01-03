const mongoose = require('mongoose');

const growthPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    year: {
        type: Number,
        required: true,
        default: () => new Date().getFullYear()
    },
    items: [{
        desiredSelf: { type: String, default: '' },
        goal: { type: String, default: '' },
        motivation: { type: String, default: '' },
        activities: [{
            content: { type: String, default: '' },
            outcome: { type: String, default: '' } // For Yearly Result
        }]
    }],
    yearlyOverview: [{
        month: Number,
        content: { type: String, default: '' },
        summary: { type: String, default: '' }
    }],
    reflection: {
        summary: { type: String, default: '' },
        detail: { type: String, default: '' }
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

growthPlanSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('GrowthPlan', growthPlanSchema);
