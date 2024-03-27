const express = require('express');
const {
    createReview,
    updateReview,
    deleteReview,
    getAllReviews,
    getSingleReview,
    getSingleBookReviews,
} = require('../controllers/reviewController');
const isAuthenticated = require('../middleware/isAuthenticated');

const reviewRouter = express.Router();
reviewRouter.post('/', isAuthenticated,createReview);
reviewRouter.get('/',isAuthenticated, getAllReviews);
reviewRouter.delete('/:reviewId',isAuthenticated, deleteReview);
reviewRouter.put('/:reviewId',isAuthenticated, updateReview);
reviewRouter.get('/getbyid/:reviewId', isAuthenticated,getSingleReview);
// return all review for specific id of book
reviewRouter.get('/:bookId',isAuthenticated, getSingleBookReviews);
module.exports = reviewRouter;