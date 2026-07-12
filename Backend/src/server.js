const app = require('./app');
const config = require('./config');
const { connectDB, gracefulShutdown } = require('./db/connection');
const { startCronJobs } = require('./services/cron.service');

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(config.port, () => {
    console.log(`[Server] AssetFlow API running on port ${config.port} [${config.env}]`);
    startCronJobs();
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`[Server] Port ${config.port} is already in use`);
    } else {
      console.error(`[Server] Error: ${error.message}`);
    }
  });
};

process.on('SIGTERM', () => {
  if (server) {
    server.close(async () => {
      await gracefulShutdown('SIGTERM');
    });
  } else {
    gracefulShutdown('SIGTERM');
  }
});

process.on('SIGINT', () => {
  if (server) {
    server.close(async () => {
      await gracefulShutdown('SIGINT');
    });
  } else {
    gracefulShutdown('SIGINT');
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Server] Uncaught Exception:', error.message);
});

startServer();

module.exports = server;
