'use strict';

const { PutObjectCommand } = require('@aws-sdk/client-s3');
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
  if (!ext) throw new AppError('Unsupported file type.', 400);

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

  const url = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  logger.info(`Receipt uploaded: ${url}`);
  return url;
}

module.exports = { uploadReceipt };
