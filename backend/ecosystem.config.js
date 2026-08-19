// ecosystem.config.js — PM2 production process manager configuration
module.exports = {
  apps: [{
    name:         'cloudstay-api',
    script:       './src/server.js',
    instances:    2,                  // cluster mode — 2 workers
    exec_mode:    'cluster',
    watch:        false,
    max_memory_restart: '300M',
    env_production: {
      NODE_ENV: 'production',
      PORT:     5000,
    },
    log_file:     './logs/pm2-combined.log',
    out_file:     './logs/pm2-out.log',
    error_file:   './logs/pm2-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs:   true,
    restart_delay: 3000,
    max_restarts:  10,
  }],
};
