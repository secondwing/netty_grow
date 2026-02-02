const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, authorization denied' });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
};

const User = require('../models/User');

const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === 'admin') {
            next();
        } else {
            console.log('Admin authorization failed:', {
                reqUserId: req.user.id,
                foundUser: user ? { id: user._id, role: user.role } : 'null'
            });
            res.status(403).json({ message: 'Admin authorization denied' });
        }
    } catch (err) {
        console.error('Server Error in verifyAdmin:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { auth, verifyAdmin };
