'use strict';

/**
 * Structured success response helper.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {any}    data - Response payload
 * @param {string} [message] - Optional message
 */
function sendSuccess(res, statusCode, data, message) {
  const body = { success: true };
  if (message)          body.message = message;
  if (data !== undefined) body.data  = data;
  return res.status(statusCode).json(body);
}

/**
 * Paginated list response.
 * @param {object} res
 * @param {Array}  rows - Data rows for current page
 * @param {number} total - Total record count
 * @param {number} page
 * @param {number} limit
 */
function sendPaginated(res, rows, total, page, limit) {
  return res.status(200).json({
    success: true,
    data: rows,
    pagination: {
      page:  parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

/**
 * Application-level operational error.
 * Distinguishes predictable (operational) from unexpected errors.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode    = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { sendSuccess, sendPaginated, AppError };
