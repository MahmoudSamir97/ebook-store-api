const isAuthenticated = require('../middleware/isAuthenticated');
const cartCpyModel = require('../models/cartCpyModel');

const cartcpyRouter = require('express').Router();

cartcpyRouter.get('/', isAuthenticated, async (req, res) => {
    try {
        const userCart = await cartCpyModel.findOne({ userId: req.user._id });
        res.status(200).json({ userCart });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
});
cartcpyRouter.post('/', isAuthenticated, async (req, res) => {
    try {
        const { bookTitle, bookPrice, bookImage } = req.body;
        let cart = await cartCpyModel.findOne({ userId: req.user._id });
        if (!cart) {
            cart = await cartCpyModel.create({ userId: req.user._id, items: [] });
        }
        const existingItem = cart.items.find((item) => item.bookTitle === bookTitle);
        if (!existingItem) {
            cart.items.push({ bookTitle, bookPrice, bookImage });
        }
        await cart.save();
        res.status(200).json({ cart });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
});
cartcpyRouter.post('/delete', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id;
        const bookTitleToDelete = req.body.bookTitle;
        const cartData = await cartCpyModel.findOne({ userId });
        if (!cartData) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cartData.items = cartData.items.filter((item) => item.bookTitle !== bookTitleToDelete);
        const updatedCart = await cartData.save();
        res.status(200).json({ cartData: updatedCart });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
});

module.exports = cartcpyRouter;
