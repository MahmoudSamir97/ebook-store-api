const express = require('express');
const upload = require('../middleware/multer');
const {
    addBook,
    getAllBooks,
    deleteBook,
    updateBook,
    searchBooksByPrice,
    getBookById,
    getCategoryWithBook,
    getRecentBooks,
    getCategoriesWithBookCount,
} = require('../controllers/bookControllers');
const bookRouter = express.Router();

bookRouter.post(
    '/add',
    upload.fields([
        { name: 'bookPdf', maxCount: 1 },
        { name: 'bookImage', maxCount: 1 },
    ]),
    addBook
);
bookRouter.get('/AllBook', getAllBooks);
bookRouter.get('/AllBooksandcategories', getCategoriesWithBookCount);
bookRouter.get('/recent', getRecentBooks);
bookRouter.delete('/:bookId', deleteBook);
bookRouter.put(
    '/:bookId',
    upload.fields([
        { name: 'bookPdf', maxCount: 1 },
        { name: 'bookImage', maxCount: 1 },
    ]),
    updateBook
);
bookRouter.get('/search', searchBooksByPrice);
bookRouter.get('/:bookId', getBookById);
bookRouter.get('/getAllBookInCategory/:categoryId', getCategoryWithBook);
module.exports = bookRouter;