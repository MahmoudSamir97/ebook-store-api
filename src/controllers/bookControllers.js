const bookModel = require('../models/Book');
const dataurl = require('dataurl');
const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary');
const categoryModel = require('../models/category.model');
exports.addBook = async (req, res) => {
    try {
        const { bookTitle, bookPrice, Author, category, publisherName, bookDescription, user, discount } = req.body;

        // Upload image to Cloudinary
        if (!req.files) {
            return res.status(400).json({ status: 'error', message: 'Must add image' });
        }

        // Calculate price after discount if discount is provided
        let priceAfterDiscount = bookPrice; // Default price after discount is same as book price
        if (discount && discount >= 0 && discount <= 100) {
            const discountAmount = (bookPrice * discount) / 100;
            priceAfterDiscount = bookPrice - discountAmount;
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

        const newBook = new bookModel({
            bookTitle,
            bookPrice,
            Author,
            user,
            discount,
            priceAfterDiscount,
            ['bookImage.url']: uploadedBookImage.secure_url,
            ['bookImage.public_id']: uploadedBookImage.public_id,
            ['bookPdf.url']: uploadedBookPdf.secure_url,
            ['bookPdf.public_id']: uploadedBookPdf.public_id,
            category,
            publisherName,
            bookDescription,
        });

        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;

        const book = await bookModel.findById(bookId);

        if (!book) {
            return res.status(404).json({ status: 'error', data: { message: 'book not found' } });
        }
        // Remove the book image from Cloudinary
        const deleteResult = await removeFromCloudinary(book.bookImage);

        console.log('Cloudinary delete result:', deleteResult);

        await bookModel.findOneAndDelete({ _id: bookId });

        res.status(200).json({ status: 'Deleted Succefully', data: null });
    } catch (error) {
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

        const limit = query.limit || 20;
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
exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const { bookTitle, bookPrice, Author, category, publisherName, bookDescription, user, discount } = req.body;

        // Check if the book exists
        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ status: 'error', message: 'Book not found' });
        }

        // Update the fields that are provided in the request body
        if (bookTitle) book.bookTitle = bookTitle;
        if (bookPrice) book.bookPrice = bookPrice;
        if (Author) book.Author = Author;
        if (category) book.category = category;
        if (publisherName) book.publisherName = publisherName;
        if (bookDescription) book.bookDescription = bookDescription;
        if (user) book.user = user;

        // Calculate price after discount if discount is provided
        if (discount && discount >= 0 && discount <= 100) {
            const discountAmount = (book.bookPrice * discount) / 100;
            book.discount = discount;
            book.priceAfterDiscount = book.bookPrice - discountAmount;
        }

        // Handle bookPdf and bookImage updates
        if (req.files) {
            if (req.files.bookPdf) {
                const bookPdfDataUrlString = dataurl.format({
                    data: req.files.bookPdf[0].buffer,
                    mimetype: req.files.bookPdf[0].mimetype,
                });
                const uploadedBookPdf = await uploadToCloudinary(bookPdfDataUrlString, 'pdf');
                book['bookPdf.url'] = uploadedBookPdf.secure_url;
                book['bookPdf.public_id'] = uploadedBookPdf.public_id;
            }
            if (req.files.bookImage) {
                const bookImageDataUrlString = dataurl.format({
                    data: req.files.bookImage[0].buffer,
                    mimetype: req.files.bookImage[0].mimetype,
                });
                const uploadedBookImage = await uploadToCloudinary(bookImageDataUrlString, 'book image');
                book['bookImage.url'] = uploadedBookImage.secure_url;
                book['bookImage.public_id'] = uploadedBookImage.public_id;
            }
        }

        // Save the updated book
        const updatedBook = await book.save();

        res.status(200).json({ status: 'success', data: updatedBook });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
