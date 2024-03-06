const router = express.Router();

router.post('/add', upload.single('bookImage'), addBook);
router.get('/AllBook', getAllBooks);
router.delete('/:bookId', deleteBook);

module.exports = router;
