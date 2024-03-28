const express = require('express');
const {
    addToCart,
    removeItemFromCart,
    clearCart,
    getUserCart,
    getAllCarts,
} = require('../controllers/cart.controller');
const isAuthenticated = require('../middleware/isAuthenticated');
const cartRouter = express.Router();

cartRouter.post('/', isAuthenticated, addToCart);
cartRouter.get('/', isAuthenticated, getUserCart);
cartRouter.get('/all', getAllCarts);

cartRouter.delete('/:bookId', isAuthenticated, removeItemFromCart);

cartRouter.delete('/', isAuthenticated, clearCart);

module.exports = cartRouter;
