'use strict';

const { body } = require('express-validator');

const create = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 150 }),
  body('location').trim().notEmpty().withMessage('Location is required.').isLength({ max: 255 }),
  body('description').optional().isLength({ max: 2000 }),
  body('amenities').optional().isArray().withMessage('Amenities must be an array.'),
  body('contactEmail').optional().isEmail().withMessage('Invalid contact email.').normalizeEmail(),
  body('contactPhone').optional().isLength({ max: 20 }),
];

const update = [
  body('name').optional().trim().notEmpty().isLength({ max: 150 }),
  body('location').optional().trim().notEmpty().isLength({ max: 255 }),
  body('description').optional().isLength({ max: 2000 }),
  body('amenities').optional().isArray(),
  body('contactEmail').optional().isEmail().normalizeEmail(),
  body('contactPhone').optional().isLength({ max: 20 }),
  body('isActive').optional().isBoolean(),
];

const createRoom = [
  body('hostelId').notEmpty().isInt({ min: 1 }).withMessage('Valid hostel ID is required.'),
  body('roomNumber').trim().notEmpty().withMessage('Room number is required.').isLength({ max: 20 }),
  body('roomType')
    .notEmpty().withMessage('Room type is required.')
    .isIn(['single','double','triple','suite']).withMessage('Room type must be single, double, triple, or suite.'),
  body('capacity').isInt({ min: 1, max: 10 }).withMessage('Capacity must be 1–10.'),
  body('pricePerSemester')
    .isFloat({ min: 0.01 }).withMessage('Price must be a positive number.'),
  body('description').optional().isLength({ max: 1000 }),
];

const updateRoom = [
  body('roomNumber').optional().trim().notEmpty().isLength({ max: 20 }),
  body('roomType').optional().isIn(['single','double','triple','suite']),
  body('capacity').optional().isInt({ min: 1, max: 10 }),
  body('pricePerSemester').optional().isFloat({ min: 0.01 }),
  body('status').optional().isIn(['available','booked','maintenance']),
  body('description').optional().isLength({ max: 1000 }),
];

module.exports = { create, update, createRoom, updateRoom };
