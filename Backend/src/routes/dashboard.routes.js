const express = require('express');
const { getDashboardStats, getRecentActivity } = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);

module.exports = router;
