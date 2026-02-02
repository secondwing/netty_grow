const mongoose = require('mongoose');
const User = require('./models/User');
const Payment = require('./models/Payment');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/netty';

const seedPayments = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected');

        // Find some users
        const users = await User.find().limit(5);

        if (users.length === 0) {
            console.log('No users found. Please create users first.');
            process.exit();
        }

        // Create dummy payments
        const payments = [
            {
                user: users[0]._id,
                amount: 9900,
                description: 'Pro Subscription (Monthly)',
                status: 'completed',
                method: 'card',
                paymentDate: new Date()
            },
            {
                user: users[0]._id,
                amount: 19900,
                description: 'Ultra Plan Upgrade',
                status: 'pending',
                method: 'transfer',
                paymentDate: new Date(Date.now() - 86400000)
            },
            {
                user: users[1] ? users[1]._id : users[0]._id,
                amount: 9900,
                description: 'Pro Subscription (Monthly)',
                status: 'completed',
                method: 'card',
                paymentDate: new Date(Date.now() - 172800000)
            },
            {
                user: users[2] ? users[2]._id : users[0]._id,
                amount: 50000,
                description: 'Consultation Fee',
                status: 'cancelled',
                method: 'card',
                paymentDate: new Date(Date.now() - 259200000)
            }
        ];

        await Payment.deleteMany({}); // Clear old payments if any
        await Payment.insertMany(payments);

        console.log('Dummy payments created successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedPayments();
