const bookModel = require('../models/Book');
const categoryModel = require('../models/category.model');
const dataurl = require('dataurl');
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require('../services/uploadImage');
exports.addBook = async (req, res) => {
    try {
        const { bookTitle, bookPrice, Author, category, publisherName ,bookPdf,bookDescription} = req.body;
        if (!req.file) {
            return res.status(400).json({ status: 'error', messagev: 'Must add image' });
        }
        const dataUrlString = dataurl.format({
            data: req.file.buffer,
            mimetype: req.file.mimetype,
        });

        const result = await cloudinaryUploadImage(dataUrlString,'book');
        const newBook = new bookModel({
            bookTitle,
            bookPrice,
            Author,
            bookDescription,
           ['bookPdf.secure_url']: result.secure_url,
            // category:category._id,
            category: req.body.category,
            publisherName,
        });
        const savedBook = await newBook.save();

        res.status(201).json({status:"sucess" ,savedBook});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error'});
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
        const deleteResult = await cloudinaryRemoveImage(book.bookImage);

        console.log('Cloudinary delete result:', deleteResult);

        await bookModel.findOneAndDelete({ _id: bookId });

        res.status(200).json({ status: 'Done', data: null });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, data: null });
    }
};
exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.bookId; // Assuming you have the book ID in the request parameters
        const { bookTitle, bookPrice, Author ,bookDescription} = req.body; // Extract book details from request body

        // Find the book by ID
        const book = await bookModel.findById(bookId);

        // If book is not found, return error
        if (!book) {
            return res.status(404).json({ status: 'ERROR', data: { message: 'Book not found' } });
        }

        // Prepare update fields
        let updateFields = { bookTitle, bookPrice, Author ,bookDescription };

        // Check if a new image file is provided
        if (req.file) {
            // Upload image to cloudinary
            const result = await cloudinaryUploadImage(req.file.path);
            updateFields.bookPdf = result.secure_url;
        }

        // Update the book using findOneAndUpdate
        const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: updateFields }, { new: true });

        // Return success response with updated book data
        res.status(200).json({ status: 'Done', data: { updatedBook } });
    } catch (error) {
        // Return error response if any error occurs
        res.status(500).json({ status: 'error', message: error.message, data: null });
    }
};
exports.searchBooksByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;

        // Query books based on the price range
        const books = await bookModel.find({
            bookPrice: { $gte: minPrice, $lte: maxPrice },
        });

        res.status(200).json({ status: 'Done', data: { books } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, data: null });
    }
};
exports.getBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId;

        // Find the book by its ID
        const book = await bookModel.findById(bookId);

        // If book is not found, return error
        if (!book) {
            return res.status(404).json({ status: 'error', data: { message: 'Book not found' } });
        }

        // If book is found, return it in the response
        res.status(200).json({ status: 'Done', data: { book } });
    } catch (error) {
        // Return error response if any error occurs
        res.status(500).json({ status: 'error', message: error.message, data: null });
    }
};
exports.getAllBooks = async (req, res) => {
    try {
        const query = req.query;
        console.log('query', query);

        const limit = query.limit || 5;
        const page = query.page || 1;
        const skip = (page - 1) * limit;

        const allBooks = await bookModel.find({}, { __v: false }).limit(limit).skip(skip);
        res.status(200).json({ status: 'Done', data: { allBooks } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, data: null });
    }
};
exports.getCategoryWithBook = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        // Find the category by its ID
        const category = await categoryModel.findById(categoryId);

        if (!category) {
            return res.status(404).json({ status: 'FAIL', data: { message: 'Category not found' } });
        }

        // Find all products in the given category and populate the "category" field
        const allCategoryProducts = await bookModel.find({ category: categoryId }).populate('category');

        res.status(200).json({ status: 'SUCCESS', data: { allCategoryProducts } });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};
