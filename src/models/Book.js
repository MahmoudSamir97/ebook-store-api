const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        bookTitle: {
            type: String,
            required: true,
            trim: true,
        },
        bookPrice: {
            type: Number,
            required: [true, 'book price is required'],
            trim: true,
        },
        isRecent: {
            type: Boolean,
            default: false,
        },
        discount: {
            type: Number,
        },
        priceAfterDiscount: {
            type: Number,
            default: 0,
        },
        Author: {
            type: String,
            required: [true, 'Author Name is required'],
            trim: true,
        },
        bookImage: {
            url: String,
            public_id: String,
        },
        bookPdf: {
            url: String,
            public_id: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
        publisherName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Publisher',
        },
        bookDescription: {
            type: String,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// If I want to search single product, in tha product I also want to have all reviews associated with that product.
bookSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'book',
    justOne: false,
});

bookSchema.pre('remove', async function () {
    // Go to 'Reveiw; and delete all the review that are associated with this particular product
    await this.model('Review').deleteMany({ book: this._id });
});
const bookModel = mongoose.model('Book', bookSchema);

module.exports = bookModel;