'use strict';

const logger = require('../utils/logger');

/**
 * Global Express error-handling middleware.
 * Must be registered LAST in the middleware chain (4 params).
 *
 * Handles:
 *  - AppError (operational) — returns its statusCode and message
 *  - MySQL constraint errors — maps to user-friendly messages
 *  - Unexpected errors — logs stack, returns 500
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Operational errors (AppError) — known, expected
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with the provided value already exists.',
    });
  }

  // MySQL FK constraint violation
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({
      success: false,
      message: 'Cannot delete this record as it is referenced by other data.',
    });
  }

  // Unexpected / programming errors — log full stack
  logger.error('Unexpected error:', {
    message: err.message,
    stack:   err.stack,
    url:     req.url,
    method:  req.method,
  });

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again later.'
      : err.message,
  });
}

module.exports = { errorHandler };
