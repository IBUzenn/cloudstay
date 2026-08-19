'use strict';

const multer = require('multer');
const { AppError } = require('../utils/response');

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE     = 5 * 1024 * 1024;  // 5 MB

/**
 * Multer instance — stores file in memory buffer for S3 upload.
 * Validates MIME type and size before passing to controller.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: MAX_FILE_SIZE },
  fileFilter(req, file, cb) {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type. Only JPEG, PNG, and PDF are allowed.', 400));
    }
  },
});

/**
 * Wraps multer single-field upload and converts multer errors to AppError.
 * @param {string} fieldName - Form field name for the file
 */
function uploadSingle(fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (!err) return next();
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File is too large. Maximum size is 5 MB.', 400));
      }
      if (err instanceof multer.MulterError) {
        return next(new AppError(err.message, 400));
      }
      return next(err);
    });
  };
}

module.exports = { uploadSingle };
