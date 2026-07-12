const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath, override: true });
} else {
  require('dotenv').config({ override: true });
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'assetflow_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'assetflow_refresh_secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  uploadDir: path.resolve(__dirname, '../../uploads'),
  maxRetries: 10,
  retryDelayMs: 5000,
};

if (!config.mongodbUri) {
  console.warn('[Config] MONGODB_URI is not set. Database connection will retry until configured.');
}

module.exports = config;
