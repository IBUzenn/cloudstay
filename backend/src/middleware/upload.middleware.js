'use strict';

const multer = require('multer');
const { AppError } = require('../utils/response');

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE     = 10 * 1024 * 1024;  // 10 MB

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
      cb(new AppError('Invalid file type. Please upload a PDF, JPG or PNG receipt.', 400));
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
        return next(new AppError('The receipt is too large. Please choose a file smaller than 10 MB.', 400));
      }
      if (err instanceof multer.MulterError) {
        return next(new AppError(err.message, 400));
      }
      return next(err);
    });
  };
}

module.exports = { uploadSingle };
