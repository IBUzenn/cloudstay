'use strict';

const bookingService = require('../../src/services/booking.service');
const { pool }       = require('../../src/config/database');
const { AppError }   = require('../../src/utils/response');

jest.mock('../../src/config/database', () => ({
  pool: {
    getConnection: jest.fn(),
    query: jest.fn(),
  },
}));

describe('BookingService Unit Tests', () => {
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

  describe('create', () => {
    it('should create a booking successfully when room is available', async () => {
      mockConn.query
        .mockResolvedValueOnce([[{ id: 10, hostel_id: 2, status: 'available' }]]) // lock room
        .mockResolvedValueOnce([[{ activeCount: 0 }]])                              // active booking check
        .mockResolvedValueOnce([{ insertId: 100 }]);                                // insert

      pool.query.mockResolvedValueOnce([[{
        id: 100, status: 'pending', check_in_date: '2026-09-01', check_out_date: '2027-05-31',
        student_id: 1, room_id: 10, hostel_id: 2
      }]]);

      const res = await bookingService.create(1, 10, '2026-09-01', '2027-05-31');

      expect(mockConn.beginTransaction).toHaveBeenCalled();
      expect(mockConn.commit).toHaveBeenCalled();
      expect(mockConn.release).toHaveBeenCalled();
      expect(res.id).toBe(100);
    });

    it('should throw 404 if room does not exist', async () => {
      mockConn.query.mockResolvedValueOnce([[]]); // room not found

      await expect(bookingService.create(1, 99, '2026-09-01', '2027-05-31'))
        .rejects.toThrow(AppError);
      expect(mockConn.rollback).toHaveBeenCalled();
    });

    it('should throw 409 if room is not available', async () => {
      mockConn.query.mockResolvedValueOnce([[{ id: 10, hostel_id: 2, status: 'occupied' }]]);

      await expect(bookingService.create(1, 10, '2026-09-01', '2027-05-31'))
        .rejects.toThrow(AppError);
      expect(mockConn.rollback).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update status and release room when status is rejected', async () => {
      mockConn.query
        .mockResolvedValueOnce([[{ id: 100, status: 'pending', room_id: 10 }]]) // find booking
        .mockResolvedValueOnce([{}])                                             // update status
        .mockResolvedValueOnce([{}]);                                            // set room available

      pool.query.mockResolvedValueOnce([[{ id: 100, status: 'rejected' }]]);

      const res = await bookingService.updateStatus(100, 'rejected', 2, 'Incomplete payment');

      expect(mockConn.commit).toHaveBeenCalled();
      expect(res.status).toBe('rejected');
    });
  });
});
