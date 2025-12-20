require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Client URL
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
// TODO: Replace with actual connection string from .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/netty';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connection established'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRouter = require('./routes/auth');
const recordsRouter = require('./routes/records');

app.use('/api/auth', authRouter);
app.use('/api/records', recordsRouter);

app.get('/', (req, res) => {
    res.send('Netty Server is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
