const multer = require('multer');
const maxSize = 4 * 1024 * 1024;
const fileStorageEngine = multer.memoryStorage();
const upload = multer({ storage: fileStorageEngine, limits: { fileSize: maxSize } });

module.exports = upload;

