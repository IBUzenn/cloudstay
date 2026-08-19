'use strict';

const request = require('supertest');
const express = require('express');
const bookingRoutes = require('../../src/routes/booking.routes');
const { pool }        = require('../../src/config/database');
const { errorHandler } = require('../../src/middleware/error.middleware');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';

const app = express();
app.use(express.json());

// Helper tokens
const studentToken = jwt.sign({ userId: 1, role: 'student' }, process.env.JWT_SECRET);
const adminToken   = jwt.sign({ userId: 9, role: 'admin' }, process.env.JWT_SECRET);

app.use('/api/bookings', bookingRoutes);
app.use(errorHandler);

jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn(),
  },
}));

describe('Booking API Integration Tests', () => {
  let mockConn;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConn = {
      beginTransaction: jest.fn(),
      commit:           jest.fn(),
      rollback:         jest.fn(),
      release:          jest.fn(),
      query:            jest.fn(),
    };
    pool.getConnection.mockResolvedValue(mockConn);
  });

  describe('POST /api/bookings', () => {
    it('should create booking for authenticated student', async () => {
      mockConn.query
        .mockResolvedValueOnce([[{ id: 10, hostel_id: 2, status: 'available' }]])
        .mockResolvedValueOnce([[{ activeCount: 0 }]])
        .mockResolvedValueOnce([{ insertId: 100 }]);

      pool.query.mockResolvedValueOnce([[{
        id: 100, status: 'pending', check_in_date: '2026-09-01', check_out_date: '2027-05-31',
        student_id: 1, room_id: 10
      }]]);

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ roomId: 10, checkInDate: '2026-09-01', checkOutDate: '2027-05-31' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .send({ roomId: 10, checkInDate: '2026-09-01', checkOutDate: '2027-05-31' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings/my', () => {
    it('should return bookings for authenticated student', async () => {
      pool.query
        .mockResolvedValueOnce([[{ id: 100, student_id: 1, status: 'pending' }]])
        .mockResolvedValueOnce([[{ total: 1 }]]);

      const res = await request(app)
        .get('/api/bookings/my')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('PUT /api/bookings/:id/status', () => {
    it('should allow admin to update booking status', async () => {
      mockConn.query
        .mockResolvedValueOnce([[{ id: 100, status: 'pending', room_id: 10 }]])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([{}]);

      pool.query.mockResolvedValueOnce([[{ id: 100, status: 'approved' }]]);

      const res = await request(app)
        .put('/api/bookings/100/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved', reviewNote: 'Payment verified' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject student attempt with 403 Forbidden', async () => {
      const res = await request(app)
        .put('/api/bookings/100/status')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ status: 'approved' });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
