const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
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
    Author: {
        type: String,
        required: [true, 'Author Name is required'],
        trim: true,

    },
    bookImage: {
        type: String,
        required:true
    },
    bookPdf: {
        type: String,
        // required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        // required: [true]
    },
    publisherName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publisher',
        // required: [true, 'Publisher name is required'],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const bookModel = mongoose.model('Book', bookSchema);

module.exports = bookModel;
