'use strict';

const hostelService = require('../../src/services/hostel.service');
const { pool }        = require('../../src/config/database');
const { AppError }    = require('../../src/utils/response');

jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('HostelService Unit Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('should return paginated hostel records', async () => {
      const mockHostels = [{ id: 1, name: 'Pentagon', amenities: '["WiFi"]' }];
      pool.query
        .mockResolvedValueOnce([mockHostels])
        .mockResolvedValueOnce([[{ total: 1 }]]);

      const res = await hostelService.findAll({ page: 1, limit: 10 });

      expect(res.hostels).toHaveLength(1);
      expect(res.total).toBe(1);
      expect(res.hostels[0].amenities).toEqual(['WiFi']);
    });
  });

  describe('findById', () => {
    it('should return hostel with rooms when found', async () => {
      const mockHostel = [{ id: 1, name: 'Pentagon', amenities: '["WiFi"]' }];

      pool.query.mockResolvedValueOnce([mockHostel]);

      const res = await hostelService.findById(1);

      expect(res.id).toBe(1);
      expect(res.amenities).toEqual(['WiFi']);
    });

    it('should throw 404 if hostel does not exist', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      await expect(hostelService.findById(999)).rejects.toThrow(AppError);
    });
  });
});
