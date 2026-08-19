'use strict';

const jwt     = require('jsonwebtoken');
const { AppError } = require('../utils/response');

/**
 * Middleware: Verify JWT access token.
 * Attaches decoded payload to req.user on success.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('No authentication token provided.', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;     // { userId, role, iat, exp }
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Access token has expired. Please refresh.', 401));
    }
    return next(new AppError('Invalid access token.', 401));
  }
}

module.exports = { authenticate };
