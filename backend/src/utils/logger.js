'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat,
  ),
  transports: [
    // Console output (colorised in dev)
    new transports.Console({
      format: process.env.NODE_ENV === 'production'
        ? combine(timestamp(), errors({ stack: true }), logFormat)
        : combine(colorize(), timestamp({ format: 'HH:mm:ss' }), errors({ stack: true }), logFormat),
    }),
    // File transport — picked up by CloudWatch agent
    new transports.File({
      filename: 'logs/error.log',
      level:    'error',
      maxsize:  10 * 1024 * 1024,  // 10 MB
      maxFiles: 5,
    }),
    new transports.File({
      filename: 'logs/combined.log',
      maxsize:  10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

// Add HTTP level for morgan
logger.http = (msg) => logger.log('http', msg);

module.exports = logger;
