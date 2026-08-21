'use strict';

const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { s3Client, S3_BUCKET } = require('../config/aws');
const { AppError } = require('../utils/response');
const logger = require('../utils/logger');

const MIME_TO_EXT = {
  'image/jpeg':      '.jpg',
  'image/png':       '.png',
  'application/pdf': '.pdf',
};

/**
 * Upload a payment receipt buffer to AWS S3.
 * @param {number} bookingId - Used in the S3 key path
 * @param {Buffer} buffer    - File buffer from multer memoryStorage
 * @param {string} mimetype  - File MIME type
 * @returns {string} Public-accessible S3 object URL
 */
async function uploadReceipt(bookingId, buffer, mimetype) {
  const ext = MIME_TO_EXT[mimetype];
  if (!ext) throw new AppError('Unsupported file type. Please upload a PDF, JPG or PNG receipt.', 400);

  const key = `receipts/${bookingId}/${uuidv4()}${ext}`;

  try {
    await s3Client.send(new PutObjectCommand({
      Bucket:      S3_BUCKET,
      Key:         key,
      Body:        buffer,
      ContentType: mimetype,
      // Objects are private — access only via IAM
      ServerSideEncryption: 'AES256',
    }));
  } catch (err) {
    logger.error('S3 upload failed:', err.message);
    throw new AppError('Failed to upload file to storage. Please try again.', 502);
  }

  const url = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION || 'ap-southeast-1'}.amazonaws.com/${key}`;
  logger.info(`Receipt uploaded: ${url}`);
  return url;
}

/**
 * Stream an S3 receipt file securely to the caller.
 * @param {string} receiptUrl - Full S3 URL or S3 key
 * @returns {Promise<{ stream: ReadableStream, contentType: string, contentLength: number }>}
 */
async function getReceiptStream(receiptUrl) {
  if (!receiptUrl) throw new AppError('No receipt uploaded for this booking.', 404);

  let key = receiptUrl;
  if (receiptUrl.startsWith('http://') || receiptUrl.startsWith('https://')) {
    try {
      const urlObj = new URL(receiptUrl);
      key = urlObj.pathname.replace(/^\//, '');
    } catch (e) {
      key = receiptUrl;
    }
  }

  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    });
    const response = await s3Client.send(command);
    return {
      stream: response.Body,
      contentType: response.ContentType || 'application/octet-stream',
      contentLength: response.ContentLength,
    };
  } catch (err) {
    logger.error(`S3 receipt fetch error for key "${key}":`, err.message);
    throw new AppError('We could not load this receipt right now. Please try again.', 404);
  }
}

module.exports = { uploadReceipt, getReceiptStream };
