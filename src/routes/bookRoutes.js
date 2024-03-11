const express = require('express');
const upload = require('../middleware/multer');
const { addBook, getAllBooks, deleteBook } = require('../controllers/bookControllers');
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
bookRouter.delete('/:bookId', deleteBook);

module.exports = bookRouter;
