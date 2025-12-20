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

module.exports = auth;
