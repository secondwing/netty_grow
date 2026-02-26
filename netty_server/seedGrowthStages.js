const mongoose = require('mongoose');
const dotenv = require('dotenv');
const GrowthStage = require('./models/GrowthStage');

dotenv.config();

const stages = [
    {
        stageId: 'growth_01',
        name: '땅',
        description: '아직 아무것도 없지만, 무한한 가능성을 품은 땅입니다.',
        imageUrl: '/growth/growth_01.png',
        minScore: 0,
        maxScore: 4
    },
    {
        stageId: 'growth_02',
        name: '씨앗',
        description: '변화의 의지를 품고 막 깨어난 씨앗입니다.',
        imageUrl: '/growth/growth_02.png',
        minScore: 5,
        maxScore: 7
    },
    {
        stageId: 'growth_03',
        name: '새싹',
        description: '힘차게 땅을 뚫고 올라온 여린 새싹입니다.',
        imageUrl: '/growth/growth_03.png',
        minScore: 8,
        maxScore: 10
    },
    {
        stageId: 'growth_04',
        name: '꽃',
        description: '아름답게 피어나는 꽃입니다.',
        imageUrl: '/growth/growth_04.png',
        minScore: 11,
        maxScore: 12
    },
    {
        stageId: 'growth_05',
        name: '꽃다발',
        description: '여러 송이가 모여 풍성한 꽃다발이 되었습니다.',
        imageUrl: '/growth/growth_05.png',
        minScore: 13,
        maxScore: 100 // Open ended high score
    },
    {
        stageId: 'growth_06',
        name: '정원',
        description: '모든 성장의 과정을 거쳐 완성된 아름다운 정원입니다.',
        imageUrl: '/growth/growth_06.png',
        minScore: 999, // Admin only
        maxScore: 999
    }
];

const seedStages = async () => {
    try {
        console.log('Connecting to MongoDB...');
        // hardcode or check env
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/netty_dev';
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // Clear existing stages to ensure fresh start
        await GrowthStage.deleteMany({});
        console.log('Cleared existing Growth Stages');

        await GrowthStage.insertMany(stages);
        console.log('Growth Stages Seeded Successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding growth stages:', error);
        process.exit(1);
    }
};

seedStages();
