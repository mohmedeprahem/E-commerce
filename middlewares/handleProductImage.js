const multer = require('multer');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/img/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
  }
});

// File size and type validation
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/png'];
  // Maximum file size (in bytes)
  const maxSize = 5 * 1024 * 1024; // 5MB

  // Check file type
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Invalid file type. Only JPEG and PNG files are allowed.');
    error.code = 'INVALID_FILE_TYPE';
    return cb(error, false);
  }

  // Check file size
  if (file.size > maxSize) {
    const error = new Error('File size exceeds the limit of 5MB.');
    error.code = 'LIMIT_EXCEEDED';
    return cb(error, false);
  }

  // File is valid
  cb(null, true);
};

// Set up Multer
const upload = multer({ 
  storage,
  fileFilter
});

module.exports = upload