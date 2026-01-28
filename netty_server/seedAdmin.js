const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const username = process.argv[2];

        if (!username) {
            console.error('Please provide a username to promote to admin.');
            console.log('Usage: node seedAdmin.js <username>');
            process.exit(1);
        }

        const user = await User.findOne({ username });

        if (!user) {
            console.error(`User with username "${username}" not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`User "${username}" has been promoted to admin.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
