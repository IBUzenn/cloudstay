'use strict';

const { body } = require('express-validator');

const create = [
  body('roomId').notEmpty().isInt({ min: 1 }).withMessage('Valid room ID is required.'),
  body('checkInDate')
    .notEmpty().withMessage('Check-in date is required.')
    .isISO8601().withMessage('Check-in date must be a valid date (YYYY-MM-DD).')
    .custom((value) => {
      if (new Date(value) < new Date()) throw new Error('Check-in date cannot be in the past.');
      return true;
    }),
  body('checkOutDate')
    .notEmpty().withMessage('Check-out date is required.')
    .isISO8601().withMessage('Check-out date must be a valid date (YYYY-MM-DD).')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkInDate)) {
        throw new Error('Check-out date must be after check-in date.');
      }
      return true;
    }),
];

const updateStatus = [
  body('status')
    .notEmpty().withMessage('Status is required.')
    .isIn(['approved','rejected','cancelled']).withMessage('Status must be approved, rejected, or cancelled.'),
  body('reviewNote').optional().isLength({ max: 500 }),
];

module.exports = { create, updateStatus };
