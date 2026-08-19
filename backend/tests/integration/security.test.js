'use strict';

const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/auth.routes');
const bookingRoutes = require('../../src/routes/booking.routes');
const { pool } = require('../../src/config/database');
const { errorHandler } = require('../../src/middleware/error.middleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Set env vars for JWT
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_SECRET = 'refresh_secret';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use(errorHandler);

jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Security & Authorization Integration Tests', () => {
  let student1Token, student2Token, adminToken;

  beforeAll(() => {
    student1Token = jwt.sign({ userId: 1, role: 'student' }, process.env.JWT_SECRET);
    student2Token = jwt.sign({ userId: 2, role: 'student' }, process.env.JWT_SECRET);
    adminToken    = jwt.sign({ userId: 9, role: 'admin' },   process.env.JWT_SECRET);
  });

  beforeEach(() => jest.clearAllMocks());

  describe('Password Hash Security', () => {
    it('should never return password_hash in login response', async () => {
      const hashedPassword = await bcrypt.hash('Password@123', 10);
      const mockUser = {
        id: 1,
        name: 'Test Student',
        email: 'test@student.edu',
        password_hash: hashedPassword,
        role: 'student',
        is_active: 1,
      };

      pool.query.mockResolvedValueOnce([[mockUser]]);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@student.edu', password: 'Password@123' });

      expect(res.status).toBe(200);
      expect(res.body.data.user.password_hash).toBeUndefined();
      expect(res.body.data.user.password).toBeUndefined();
    });
  });

  describe('Route Authorization Enforcement', () => {
    it('should return 401 for requests with invalid or forged JWT token', async () => {
      const res = await request(app)
        .get('/api/bookings/my')
        .set('Authorization', 'Bearer invalid.token.value');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 403 when student tries to access admin-only endpoint', async () => {
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${student1Token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('should allow admin to access administrative endpoints', async () => {
      pool.query.mockResolvedValueOnce([[]]).mockResolvedValueOnce([[{ total: 0 }]]);

      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 403 if student attempts to view another student booking', async () => {
      pool.query.mockResolvedValueOnce([[{
        id: 100,
        student_id: 2, // belongs to student 2
        status: 'pending',
      }]]);

      const res = await request(app)
        .get('/api/bookings/100')
        .set('Authorization', `Bearer ${student1Token}`); // requested by student 1

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
