const express = require('express');
const {
    createReview,
    updateReview,
    deleteReview,
    getAllReviews,
    getSingleReview,
    getSingleBookReviews,
} = require('../controllers/reviewController');
const reviewRouter = express.Router();
reviewRouter.post('/', createReview);
reviewRouter.get('/', getAllReviews);
reviewRouter.delete('/:reviewId', deleteReview);
reviewRouter.put('/:reviewId', updateReview);
reviewRouter.get('/getbyid/:reviewId', getSingleReview);
// return all review for specific id of book
reviewRouter.get('/:bookId', getSingleBookReviews);
module.exports = reviewRouter;
