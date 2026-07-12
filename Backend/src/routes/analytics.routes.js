const express = require('express');
const ctrl = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);
router.use(authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD));

router.get('/utilization', ctrl.getUtilization);
router.get('/most-used', ctrl.getMostUsed);
router.get('/least-used', ctrl.getLeastUsed);
router.get('/departments', ctrl.getDepartmentAnalytics);

module.exports = router;
