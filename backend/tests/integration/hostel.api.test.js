const request = require('supertest');
const express = require('express');
const hostelRoutes = require('../../src/routes/hostel.routes');
const { pool } = require('../../src/config/database');

const { errorHandler } = require('../../src/middleware/error.middleware');

// Setup a small express app for testing the route
const app = express();
app.use(express.json());
// Mock auth middleware to allow all requests as an admin
jest.mock('../../src/middleware/auth.middleware', () => {
  return {
    authenticate: (req, res, next) => { req.user = { id: 1, role: 'admin' }; next(); },
  };
});
jest.mock('../../src/middleware/role.middleware', () => {
  return {
    requireRole: (...roles) => (req, res, next) => next(),
  };
});
app.use('/api/hostels', hostelRoutes);
app.use(errorHandler);

// Mock the database pool
jest.mock('../../src/config/database', () => ({
  pool: {
    execute: jest.fn(),
    query: jest.fn(),
  },
}));

describe('Hostel API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/hostels', () => {
    it('should return a list of hostels', async () => {
      const mockHostels = [
        { id: 1, name: 'Pentagon Hostel', location: 'Campus East', total_rooms: 100, amenities: JSON.stringify(['WiFi']) }
      ];
      pool.query
        .mockResolvedValueOnce([mockHostels])
        .mockResolvedValueOnce([[{ total: 1 }]]);

      const res = await request(app).get('/api/hostels');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Pentagon Hostel');
    });
  });

  describe('GET /api/hostels/:id', () => {
    it('should return a specific hostel if found', async () => {
      const mockHostel = [{ id: 1, name: 'Pentagon Hostel', amenities: JSON.stringify(['WiFi']) }];
      pool.query
        .mockResolvedValueOnce([mockHostel])
        .mockResolvedValueOnce([[]]); // rooms query

      const res = await request(app).get('/api/hostels/1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Pentagon Hostel');
    });

    it('should return 404 if hostel not found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const res = await request(app).get('/api/hostels/999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Hostel not found.');
    });
  });
});
