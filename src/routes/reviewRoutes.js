const reviewRouter = require('express').Router({ mergeParams: true });
const { createReview, getProductReviews } = require('../controllers/reviewController');
const isAuthenticated = require('../middleware/isAuthenticated');

reviewRouter.post('/', isAuthenticated, createReview);
reviewRouter.get('/', getProductReviews);
// reviewRouter.delete('/:reviewId');
// reviewRouter.put('/:reviewId');

module.exports = reviewRouter;
