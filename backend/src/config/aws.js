'use strict';

const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  // Credentials are resolved automatically from:
  //   1. Environment variables (dev): AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY
  //   2. EC2 Instance Profile (production): no credentials needed in code
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
});

const S3_BUCKET = process.env.AWS_S3_BUCKET;

module.exports = { s3Client, S3_BUCKET };
