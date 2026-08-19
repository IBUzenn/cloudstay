'use strict';

const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new student account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email or student ID already exists
 *       422:
 *         description: Validation errors
 */
async function register(req, res, next) {
  try {
    const { name, email, studentId, password } = req.body;
    const user = await authService.register(name, email, studentId, password);
    sendSuccess(res, 201, user, 'Registration successful. Please login.');
  } catch (err) { next(err); }
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and receive JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful with tokens
 *       401:
 *         description: Invalid credentials
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccess(res, 200, result, 'Login successful.');
  } catch (err) { next(err); }
}

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, 200, result);
  } catch (err) { next(err); }
}

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout and revoke refresh tokens
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
async function logout(req, res, next) {
  try {
    await authService.revokeRefreshTokens(req.user.userId);
    sendSuccess(res, 200, null, 'Logged out successfully.');
  } catch (err) { next(err); }
}

module.exports = { register, login, refreshToken, logout };
