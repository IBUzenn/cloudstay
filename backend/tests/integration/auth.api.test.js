const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/auth.routes');
const { pool } = require('../../src/config/database');
const bcrypt = require('bcryptjs');

const { errorHandler } = require('../../src/middleware/error.middleware');

// Set env vars for JWT
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_SECRET = 'refresh_secret';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

// Setup a small express app for testing the route
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

// Mock the database pool
jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn(),
    execute: jest.fn(),
  },
}));

describe('Auth API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock db checking if user exists (returns empty array)
      pool.query.mockResolvedValueOnce([[]]);
      
      // Mock db insert
      pool.query.mockResolvedValueOnce([{ insertId: 1 }]);

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Student',
          email: 'test@student.edu',
          password: 'Password@123',
          studentId: 'STU-123'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Registration successful. Please login.');
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it('should return 400 if validation fails', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: '', // Invalid empty name
          email: 'invalid-email',
          password: '123' // Too short
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(pool.query).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const hashedPassword = await bcrypt.hash('Password@123', 10);
      const mockUser = {
        id: 1,
        name: 'Test Student',
        email: 'test@student.edu',
        password_hash: hashedPassword,
        role: 'student',
        is_active: 1
      };

      // Mock user lookup
      pool.query.mockResolvedValueOnce([[mockUser]]);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@student.edu',
          password: 'Password@123'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.email).toBe('test@student.edu');
    });

    it('should return 401 for invalid credentials', async () => {
      // Mock user lookup (user not found)
      pool.query.mockResolvedValueOnce([[]]);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@student.edu',
          password: 'WrongPassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email or password.');
    });
  });
});
