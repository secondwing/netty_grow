const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Payment = require('../models/Payment');

// @route   POST api/payments
// @desc    Create a payment record (For testing/simulation)
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { amount, description, status, method } = req.body;

        const newPayment = new Payment({
            user: req.user.id,
            amount,
            description,
            status: status || 'completed',
            method: method || 'card'
        });

        const payment = await newPayment.save();
        res.json(payment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
