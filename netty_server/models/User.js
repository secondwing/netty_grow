const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // 아이디
    nickname: { type: String, required: true, unique: true }, // 닉네임 (New)
    password: { type: String, required: true }, // 비밀번호 (Hashed)
    name: { type: String, required: true }, // 이름
    gender: { type: String, enum: ['male', 'female', 'undisclosed'], required: true }, // 성별
    birthDate: { type: String, required: true }, // 생년월일 (YYYY-MM-DD)
    phone: { type: String, required: true, unique: true }, // 핸드폰 번호
    location: { type: String, required: true }, // 사는 지역 (도/시/군/동)
    affiliation: {
        type: String,
        enum: ['student', 'job_seeker', 'worker', 'freelancer', 'entrepreneur', 'pre_entrepreneur', 'resting'],
        required: true
    }, // 소속
    consent: { type: Boolean, required: true }, // 개인정보수집 및 활용 동의
    description: { type: String, default: '' }, // 한 줄 소개
    growthTestResults: {
        test1: { type: Number }, // 1-4
        test2: { type: Number }, // 1-4
        test3: { type: Number }, // 1-6
        takenAt: { type: Date, default: Date.now }
    },
    growthStage: { type: String, default: 'growth_01' }, // growth_01 ~ growth_06
    role: { type: String, enum: ['guest', 'member', 'admin'], default: 'guest' }, // guest, member, admin
    inspectionStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' }, // 점검 진행 여부
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
