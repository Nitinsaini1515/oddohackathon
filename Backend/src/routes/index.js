const express = require('express');
const authRoutes = require('./auth.routes');
const departmentRoutes = require('./department.routes');
const employeeRoutes = require('./employee.routes');
const categoryRoutes = require('./category.routes');
const assetRoutes = require('./asset.routes');
const allocationRoutes = require('./allocation.routes');
const bookingRoutes = require('./booking.routes');
const maintenanceRoutes = require('./maintenance.routes');
const auditRoutes = require('./audit.routes');
const notificationRoutes = require('./notification.routes');
const reportRoutes = require('./report.routes');
const analyticsRoutes = require('./analytics.routes');
const innovationRoutes = require('./innovation.routes');
const dashboardRoutes = require('./dashboard.routes');
const { isDBConnected, getConnectionState } = require('../db/connection');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/employees', employeeRoutes);
router.use('/categories', categoryRoutes);
router.use('/assets', assetRoutes);
router.use('/allocations', allocationRoutes);
router.use('/bookings', bookingRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/audits', auditRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/innovation', innovationRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AssetFlow API is running',
    data: {
      service: 'AssetFlow Backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: {
        connected: isDBConnected(),
        state: getConnectionState(),
      },
    },
  });
});

module.exports = router;
