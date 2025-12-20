const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // 아이디
    password: { type: String, required: true }, // 비밀번호 (Hashed)
    name: { type: String, required: true }, // 이름
    gender: { type: String, enum: ['male', 'female'], required: true }, // 성별
    birthDate: { type: Date, required: true }, // 생년월일
    phone: { type: String, required: true, unique: true }, // 핸드폰 번호
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
