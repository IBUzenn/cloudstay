'use strict';

const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               parseInt(process.env.DB_PORT, 10) || 3306,
  database:           process.env.DB_NAME,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit:    parseInt(process.env.DB_POOL_MAX, 10) || 10,
  queueLimit:         0,
  timezone:           'Z',         // Store/retrieve in UTC
  charset:            'utf8mb4',
  connectTimeout:     10000,
});

/**
 * Test database connectivity on startup.
 * Throws if the connection cannot be established.
 */
async function testConnection() {
  const conn = await pool.getConnection();
  logger.info(`Database connected: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  conn.release();
}

module.exports = { pool, testConnection };
