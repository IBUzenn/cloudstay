'use strict';

const request = require('supertest');
const express = require('express');
const bookingRoutes = require('../../src/routes/booking.routes');
const { pool }        = require('../../src/config/database');
const { errorHandler } = require('../../src/middleware/error.middleware');
const { s3Client }    = require('../../src/config/aws');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';

const app = express();
app.use(express.json());

const studentToken = jwt.sign({ userId: 1, role: 'student' }, process.env.JWT_SECRET);

app.use('/api/bookings', bookingRoutes);
app.use(errorHandler);

jest.mock('../../src/config/database', () => ({
  pool: {
    query: jest.fn(),
  },
}));

jest.mock('../../src/config/aws', () => ({
  s3Client: {
    send: jest.fn(),
  },
  S3_BUCKET: 'test-bucket',
}));

describe('Upload & S3 API Integration Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should upload valid receipt JPEG image to mocked S3', async () => {
    // Mock booking lookup in uploadReceipt controller (findById)
    pool.query
      .mockResolvedValueOnce([[{ id: 100, student_id: 1, status: 'pending' }]]) // findById
      .mockResolvedValueOnce([{}])                                             // update receipt_url
      .mockResolvedValueOnce([[{ id: 100, student_id: 1, receipt_url: 'https://test-bucket.s3.test-region.amazonaws.com/receipts/100/test.jpg' }]]); // findById in controller response

    // Mock S3 success
    s3Client.send.mockResolvedValueOnce({});

    const res = await request(app)
      .post('/api/bookings/100/receipt')
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('receipt', Buffer.from('fake-image-data'), {
        filename: 'receipt.jpg',
        contentType: 'image/jpeg',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.receipt_url).toContain('https://test-bucket.s3');
    expect(s3Client.send).toHaveBeenCalledTimes(1);
  });

  it('should reject invalid file types (e.g. text/plain)', async () => {
    const res = await request(app)
      .post('/api/bookings/100/receipt')
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('receipt', Buffer.from('plain-text-content'), {
        filename: 'notes.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid file type');
    expect(s3Client.send).not.toHaveBeenCalled();
  });

  it('should reject oversized file (>5MB)', async () => {
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB

    const res = await request(app)
      .post('/api/bookings/100/receipt')
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('receipt', largeBuffer, {
        filename: 'large.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('File is too large');
    expect(s3Client.send).not.toHaveBeenCalled();
  });

  it('should handle S3 upload failures gracefully with 502', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 100, student_id: 1 }]]);
    s3Client.send.mockRejectedValueOnce(new Error('S3 Network Timeout'));

    const res = await request(app)
      .post('/api/bookings/100/receipt')
      .set('Authorization', `Bearer ${studentToken}`)
      .attach('receipt', Buffer.from('pdf-data'), {
        filename: 'receipt.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(502);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Failed to upload file to storage');
  });

  it('should reject unauthenticated upload requests with 401', async () => {
    const res = await request(app)
      .post('/api/bookings/100/receipt')
      .attach('receipt', Buffer.from('pdf-data'), {
        filename: 'receipt.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
