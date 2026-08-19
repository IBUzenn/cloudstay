'use strict';

require('dotenv').config();
const { testConnection } = require('./config/database');
const app = require('./config/app');
const logger = require('./utils/logger');

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function bootstrap() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      logger.info(`CloudStay API running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

// ─── Graceful Shutdown ───────────────────────────────────────
process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection:', reason);
  process.exit(1);
});

bootstrap();
