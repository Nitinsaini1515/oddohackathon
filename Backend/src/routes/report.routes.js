const express = require('express');
const ctrl = require('../controllers/report.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD));

router.get('/assets', ctrl.getAssetReport);
router.get('/departments', ctrl.getDepartmentReport);
router.get('/maintenance', ctrl.getMaintenanceReport);
router.get('/bookings', ctrl.getBookingReport);

module.exports = router;
