const Review = require("../models/reviewModel");
const Book = require("../models/Book");

const createReview = async (req, res) => {
    const { rating, title, comment, book  } = req.body; // Changed 'Book' to 'book'
    try {
        const bookExist = await Book.findById(book); // Changed 'Book' to 'book'
        if (!bookExist) {
            return res.status(404).json({
                success: false,
                error: `Book with id ${book} not found`, // Changed 'Book' to 'Book'
            });
        }
        const alreadyReviewed = await Review.findOne({ user: req.body.user, book }); // Changed 'Book' to 'book'
        if (alreadyReviewed) {
            return res.status(400).json({ msg: 'already reviewed' });
        }
        if (!rating || !title || !comment || !book) { // Changed 'Book' to 'book'
            return res.status(400).json({ msg: 'fill all the credentials' });
        }
        const reviewData = {
            rating,
            title,
            comment,
            book:req.body.book, // Changed 'Book' to 'book'
            user: req.body.user,

        };
        const review = await Review.create(reviewData);
        return res.status(201).json({
            success: true,
            review,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};
// const deleteReview = async (req, res) => {
//     try {
//         const { reviewId } = req.params;
//         const review = await Review.findById(reviewId);
//         if (!review) {
//             return res.status(404).json({
//                 success: false,
//                 error: `Review with id ${reviewId} not found`,
//             });
//         }
//         await review.remove(); // Remove the review from the database
//         return res.status(200).json({
//             success: true,
//             message: 'Review deleted successfully',
//         });
//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             error: error.message,
//         });
//     }
// };

const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, title, comment } = req.body;
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                error: `Review with id ${reviewId} not found`,
            });
        }
        review.rating = rating;
        review.title = title;
        review.comment = comment;
        await review.save();
        res.status(200).json({ msg: 'Success! Review updated', review });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({
            success: false,
            error: 'Review not found',
        });
        }
    await review.deleteOne();
    res.status(200).json({ msg: 'Success! Review removed' });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
  };

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).populate({
            path: 'book', // Populate the 'book' field instead of 'product'
            // select: 'name company price',
        });
        return res.status(200).json({ reviews, count: reviews.length });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const getSingleReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                error: `Review with id ${reviewId} not found`,
            });
        }
        return res.status(200).json({
            success: true,
            review,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};

const getSingleBookReviews = async (req, res) => {
    const { bookId } = req.params;
    try {
        const reviews = await Review.find({ book: bookId }); // Query based on the 'book' field
        res.status(200).json({ reviews, count: reviews.length });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    createReview,
    updateReview,
    getAllReviews,
    getSingleReview,
    deleteReview,
    getSingleBookReviews
};
