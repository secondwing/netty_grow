const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // 아이디
    password: { type: String, required: true }, // 비밀번호 (Hashed)
    name: { type: String, required: true }, // 이름
    gender: { type: String, enum: ['male', 'female'], required: true }, // 성별
    birthDate: { type: Date, required: true }, // 생년월일
    phone: { type: String, required: true, unique: true }, // 핸드폰 번호
    location: { type: String, required: true }, // 사는 지역 (도/시/군/동)
    affiliation: {
        type: String,
        enum: ['student', 'job_seeker', 'worker', 'freelancer', 'entrepreneur', 'pre_entrepreneur'],
        required: true
    }, // 소속
    consent: { type: Boolean, required: true }, // 개인정보수집 및 활용 동의
    growthTestResults: {
        test1: { type: Number }, // 1-4
        test2: { type: Number }, // 1-4
        test3: { type: Number }, // 1-6
        takenAt: { type: Date, default: Date.now }
    },
    growthStage: { type: String, default: 'growth_01' }, // growth_01 ~ growth_06
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
