const multer = require('multer');

// Set up Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;