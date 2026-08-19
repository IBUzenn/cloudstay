'use strict';

const { AppError } = require('../utils/response');

/**
 * Role-based access control middleware factory.
 * @param {string[]} allowedRoles - Array of roles that can access the route.
 * @returns {Function} Express middleware
 */
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    return next();
  };
}

module.exports = { requireRole };
