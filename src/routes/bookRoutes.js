const express = require('express');
const upload = require('../middleware/multer');
const { addBook, getAllBooks, deleteBook } = require('../controllers/bookControllers');
const bookRouter = express.Router();

bookRouter.post('/add', upload.single('bookImage'), addBook);
bookRouter.get('/AllBook', getAllBooks);
bookRouter.delete('/:bookId', deleteBook);

module.exports = bookRouter;
