const express = require('express');
const {
    addToWishlist,
    getUserWishlist,
    removeItemFromWishlist,
    clearWishlist,
} = require('../controllers/wishlist.controller');
const isAuthenticated = require('../middleware/isAuthenticated');

const wishlistRouter = express.Router();

wishlistRouter.post('/', isAuthenticated, addToWishlist);

wishlistRouter.get('/', isAuthenticated, getUserWishlist);

wishlistRouter.delete('/:bookId', isAuthenticated, removeItemFromWishlist);

wishlistRouter.delete('/', isAuthenticated, clearWishlist);

module.exports = wishlistRouter;
