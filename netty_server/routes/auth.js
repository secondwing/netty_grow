const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to calculate growth stage
const calculateGrowthStage = (results) => {
    if (!results || !results.test1 || !results.test2 || !results.test3) return 'growth_01';

    const totalScore = results.test1 + results.test2 + results.test3;

    if (totalScore <= 4) return 'growth_01';
    if (totalScore <= 7) return 'growth_02';
    if (totalScore <= 10) return 'growth_03';
    if (totalScore <= 12) return 'growth_04';
    return 'growth_05'; // 13+
    // growth_06 is manually set by admin
};

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, password, name, gender, birthDate, phone, location, affiliation, consent, growthTestResults } = req.body;

        // Check if user already exists (username or phone)
        const existingUser = await User.findOne({ $or: [{ username }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists (ID or Phone)' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Calculate initial growth stage
        const growthStage = calculateGrowthStage(growthTestResults);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            name,
            gender,
            birthDate,
            phone,
            location,
            affiliation,
            consent,
            growthTestResults,
            growthStage
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다' });
        }

        // Successful login - Generate JWT
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '24h' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({ message: 'Login successful', userId: user._id, name: user.name, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.json({ message: 'Logged out successfully' });
});

// Verify Token & Get User (Persistent Auth)
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET user info
router.get('/user/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update user info
router.put('/user/:username', async (req, res) => {
    try {
        const { name, phone, gender, birthDate, location, affiliation, growthTestResults } = req.body;

        // Create update object
        const updateData = { name, phone, gender, birthDate };
        if (location !== undefined) updateData.location = location;
        if (affiliation !== undefined) updateData.affiliation = affiliation;

        if (growthTestResults !== undefined) {
            updateData.growthTestResults = growthTestResults;

            // Recalculate stage if test results are updated
            // Only update if not already at stage 6 (admin set)
            const currentUser = await User.findOne({ username: req.params.username });
            if (currentUser && currentUser.growthStage !== 'growth_06') {
                updateData.growthStage = calculateGrowthStage(growthTestResults);
            }
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: req.params.username },
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
