'use strict';

const { AppError } = require('../../src/utils/response');
const authService  = require('../../src/services/auth.service');

// Mock the database pool
jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn(),
  },
}));

const { pool } = require('../../src/config/database');

describe('AuthService.register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should throw 409 if email already exists', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1 }]]);  // duplicate found
    await expect(
      authService.register('Test', 'exists@email.com', 'STU-001', 'Pass@1234')
    ).rejects.toThrow(AppError);
  });

  it('should return user object on success', async () => {
    pool.query
      .mockResolvedValueOnce([[]])              // no duplicate
      .mockResolvedValueOnce([{ insertId: 42 }]); // INSERT result

    const result = await authService.register('Test', 'new@email.com', 'STU-002', 'Pass@1234');
    expect(result).toMatchObject({ id: 42, email: 'new@email.com', role: 'student' });
  });
});

describe('AuthService.login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should throw 401 if user not found', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    await expect(authService.login('ghost@email.com', 'Pass@1234')).rejects.toThrow(AppError);
  });

  it('should throw 403 if account is inactive', async () => {
    pool.query.mockResolvedValueOnce([[{
      id: 1, name: 'Test', email: 'test@email.com',
      password_hash: '$2b$12$fakehash', role: 'student', is_active: 0,
    }]]);
    await expect(authService.login('test@email.com', 'Pass@1234')).rejects.toThrow(AppError);
  });
});
