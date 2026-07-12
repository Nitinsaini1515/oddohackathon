const mongoose = require('mongoose');
const config = require('../config');

let retryCount = 0;
let retryTimer = null;
let isShuttingDown = false;

const log = (level, message) => {
  const timestamp = new Date().toISOString();
  console[level === 'error' ? 'error' : 'log'](`[${timestamp}] [MongoDB] ${message}`);
};

const getConnectionState = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

const connectDB = async () => {
  if (!config.mongodbUri) {
    log('error', 'MONGODB_URI is missing. Set it in .env to enable database.');
    scheduleRetry();
    return;
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    retryCount = 0;
    log('log', `Connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
  });

  mongoose.connection.on('error', (err) => {
    log('error', `Connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    if (!isShuttingDown) {
      log('error', 'Disconnected. Scheduling automatic retry...');
      scheduleRetry();
    }
  });

  await attemptConnection();
};

const seedDefaultAdmin = async () => {
  const User = require('../models/User.model');
  const { ROLES } = require('../utils/constants');
  
  try {
    const adminExists = await User.findOne({ role: ROLES.ADMIN });
    if (!adminExists) {
      console.log('[MongoDB] Seeding default admin user...');
      await User.create({
        name: 'Super Admin',
        email: 'admin@assetflow.com',
        password: 'Admin@123',
        role: ROLES.ADMIN,
        department: 'IT Operations',
      });
      console.log('[MongoDB] Default admin user successfully seeded!');
    }
  } catch (error) {
    console.error('[MongoDB] Seeding default admin failed:', error.message);
  }
};

const attemptConnection = async () => {
  if (isShuttingDown) return;

  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    log('log', `Connecting... (attempt ${retryCount + 1})`);
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    await seedDefaultAdmin();
  } catch (error) {
    log('error', `Connection failed: ${error.message}`);
    scheduleRetry();
  }
};

const scheduleRetry = () => {
  if (isShuttingDown || retryTimer) return;

  if (retryCount >= config.maxRetries) {
    log('error', `Max retries (${config.maxRetries}) reached. Server continues; DB will retry on next request or manual restart.`);
    retryCount = 0;
    return;
  }

  retryCount += 1;
  const delay = config.retryDelayMs * Math.min(retryCount, 5);

  retryTimer = setTimeout(async () => {
    retryTimer = null;
    await attemptConnection();
  }, delay);

  log('log', `Retry scheduled in ${delay / 1000}s (attempt ${retryCount}/${config.maxRetries})`);
};

const gracefulShutdown = async (signal) => {
  isShuttingDown = true;

  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }

  log('log', `${signal} received. Closing MongoDB connection gracefully...`);

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
      log('log', 'Connection closed successfully');
    }
  } catch (error) {
    log('error', `Error during shutdown: ${error.message}`);
  }

  process.exit(0);
};

const isDBConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  connectDB,
  gracefulShutdown,
  isDBConnected,
  getConnectionState,
};
