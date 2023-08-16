const multer = require('multer');
const path = require('path'); // Import path module

// Define storage options and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Generate a unique filename for the uploaded file
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Create multer instance with storage options
const upload = multer({ storage: storage });

module.exports = upload;
