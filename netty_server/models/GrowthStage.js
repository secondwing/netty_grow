const mongoose = require('mongoose');

const GrowthStageSchema = new mongoose.Schema({
    stageId: {
        type: String,
        required: true,
        unique: true // e.g., 'growth_01', 'growth_02'
    },
    name: {
        type: String,
        required: true // e.g., '땅', '씨앗'
    },
    description: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        required: true
    },
    minScore: {
        type: Number,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('GrowthStage', GrowthStageSchema);
