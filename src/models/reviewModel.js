const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        rating: {
            type: String,
            min: 1,
            max: 5,
            required: [true, 'Please provide rating'],
        },

        comment: {
            type: String,
            required: [true, 'Please provide review text'],
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
    },
    { timestamps: true }
);

// User can leave only one review for a product
ReviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Average rating
ReviewSchema.statics.calculateAverageRating = async function (bookId) {
    try {
        const result = await this.aggregate([
            { $match: { book: bookId } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: { $toInt: '$rating' } }, // Convert rating to integer if it's stored as string
                    numOfReviews: { $sum: 1 },
                },
            },
        ]);
        // Log the result here for debugging

        if (result.length > 0) {
            await this.model('Book').findOneAndUpdate(
                { _id: bookId },
                {
                    averageRating: Math.ceil(result[0]?.averageRating || 0),
                    numOfReviews: result[0]?.numOfReviews || 0,
                }
            );
        } else {
            // If no reviews found, update book with default values
            await this.model('Book').findOneAndUpdate(
                { _id: bookId },
                {
                    averageRating: 0,
                    numOfReviews: 0,
                }
            );
        }
    } catch (error) {
        console.log(error);
    }
};

ReviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.book);
});
ReviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.book);
});

module.exports = mongoose.model('Review', ReviewSchema);
