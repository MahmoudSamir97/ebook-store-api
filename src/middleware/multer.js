// const multer = require('multer');

// const storage = multer.diskStorage({
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });

// const upload = multer({ storage: storage });

// module.exports = upload;

const multer = require('multer');
const maxSize = 4 * 1024 * 1024;
const fileStorageEngine = multer.memoryStorage();
const upload = multer({ storage: fileStorageEngine, limits: { fileSize: maxSize } });

module.exports = upload;
