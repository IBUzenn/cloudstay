'use strict';

const { body } = require('express-validator');

const register = [
  body('name')
    .trim().notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters.'),
  body('email')
    .trim().notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email address.')
    .normalizeEmail(),
  body('studentId')
    .trim().notEmpty().withMessage('Student ID is required.')
    .isLength({ min: 3, max: 50 }).withMessage('Student ID must be 3–50 characters.')
    .matches(/^[A-Za-z0-9\-]+$/).withMessage('Student ID may only contain letters, numbers, and hyphens.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number.'),
];

const login = [
  body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Invalid email.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

const refresh = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required.'),
];

module.exports = { register, login, refresh };
