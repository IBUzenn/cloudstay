'use strict';

const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { pool } = require('../config/database');
const { AppError } = require('../utils/response');

const SALT_ROUNDS = 12;

/**
 * Register a new student account.
 */
async function register(name, email, studentId, password) {
  // Check duplicate email
  const [existing] = await pool.query(
    'SELECT id FROM users WHERE email = ? OR student_id = ?',
    [email, studentId]
  );
  if (existing.length > 0) {
    throw new AppError('An account with this email or student ID already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, student_id, password_hash, role)
     VALUES (?, ?, ?, ?, 'student')`,
    [name, email, studentId, passwordHash]
  );

  return { id: result.insertId, name, email, role: 'student' };
}

/**
 * Authenticate user and return JWT tokens.
 */
async function login(email, password) {
  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ?',
    [email]
  );

  const user = rows[0];
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }
  if (!user.is_active) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403);
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const payload      = { userId: user.id, role: user.role };
  const accessToken  = jwt.sign(payload, process.env.JWT_SECRET,         { expiresIn: process.env.JWT_EXPIRES_IN        || '1h'  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });

  // Store hashed refresh token for server-side invalidation
  const tokenHash = await bcrypt.hash(refreshToken, 8);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?,?,?)',
    [user.id, tokenHash, expiresAt]
  );

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

/**
 * Issue a new access token from a valid refresh token.
 */
async function refreshAccessToken(refreshToken) {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  // Verify token exists in DB (not invalidated)
  const [rows] = await pool.query(
    'SELECT id, token_hash FROM refresh_tokens WHERE user_id = ? AND expires_at > NOW()',
    [decoded.userId]
  );

  let validToken = null;
  for (const row of rows) {
    const match = await bcrypt.compare(refreshToken, row.token_hash);
    if (match) { validToken = row; break; }
  }

  if (!validToken) {
    throw new AppError('Refresh token has been revoked or does not exist.', 401);
  }

  const newAccessToken = jwt.sign(
    { userId: decoded.userId, role: decoded.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  return { accessToken: newAccessToken };
}

/**
 * Revoke all refresh tokens for a user (logout).
 */
async function revokeRefreshTokens(userId) {
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
}

module.exports = { register, login, refreshAccessToken, revokeRefreshTokens };
