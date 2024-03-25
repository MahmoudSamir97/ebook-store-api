const isAuthenticated = require('../middleware/isAuthenticated');
const cartModel = require('../models/cart.model');

const purchasedRouter = require('express').Router();

purchasedRouter.get('/', isAuthenticated, async (req, res) => {
    try {
        const cart = await cartModel.findOne({ userId: req.user._id });
        if (!cart) return res.status(404).json({ status: 'fail', message: 'User not found!, verification failed' });
        return res.status(200).json({ status: 'success', cart });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
});

module.exports = purchasedRouter;
