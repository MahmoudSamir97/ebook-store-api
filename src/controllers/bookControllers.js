const bookModel = require('../models/Book');
const dataurl = require('dataurl');
const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary');
exports.addBook = async (req, res) => {
    try {
        const { bookTitle, bookPrice, Author, category, publisherName } = req.body;
        // Upload image to Cloudinary
        if (!req.files) {
            return res.status(400).json({ status: 'error', message: 'Must add image' });
        }
        const bookPdfDataUrlString = dataurl.format({
            data: req.files.bookPdf[0].buffer,
            mimetype: req.files.bookPdf[0].mimetype,
        });

        const bookImageDataUrlString = dataurl.format({
            data: req.files.bookImage[0].buffer,
            mimetype: req.files.bookImage[0].mimetype,
        });
        const uploadedBookImage = await uploadToCloudinary(bookImageDataUrlString, 'book image');
        const uploadedBookPdf = await uploadToCloudinary(bookPdfDataUrlString, 'pdf');

        // Create new book object with Cloudinary image URL
        const newBook = new bookModel({
            bookTitle,
            bookPrice,
            Author,
            ['bookImage.url']: uploadedBookImage.secure_url,
            ['bookImage.public_id']: uploadedBookImage.public_id,
            ['bookPdf.url']: uploadedBookPdf.secure_url,
            ['bookPdf.public_id']: uploadedBookPdf.public_id,
            category,
            publisherName,
        });

        // Save the new book to the database
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await bookModel.find();
        res.status(200).json({ status: 'Donee', data: { books } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, data: null });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;

        const book = await bookModel.findById(bookId);

        if (!book) {
            return res.status(404).json({ status: 'ERROR', data: { message: 'book not found' } });
        }

        // Remove the book image from Cloudinary
        const deleteResult = await removeFromCloudinary(book.bookImage);

        console.log('Cloudinary delete result:', deleteResult);

        await bookModel.findOneAndDelete({ _id: bookId });

        res.status(200).json({ status: 'Done', data: null });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, data: null });
    }
};
