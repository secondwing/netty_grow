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
    desiredSelf: [{
        type: String,
        trim: true
    }],
    goals: [{
        goal: String,
        action: String,
        motivation: String
    }],
    result: {
        type: String,
        default: ''
    },
    reflection: {
        type: String,
        default: ''
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
