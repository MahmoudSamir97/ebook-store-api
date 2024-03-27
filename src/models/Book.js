const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const bookSchema = new mongoose.Schema(
    {
        bookTitle: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Too short book title'],
            maxlength: [150, 'Too long book title'],
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
            minlength: [10, 'Too short book description'],
            maxlength: [1000, 'Too long book description'],
        },
        reviews: [reviewSchema],
        numReviews: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const bookModel = mongoose.model('Book', bookSchema);
module.exports = bookModel;
