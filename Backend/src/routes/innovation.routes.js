const express = require('express');
const { param } = require('express-validator');
const ctrl = require('../controllers/innovation.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/health-scores', ctrl.getHealthScores);
router.get('/idle-assets', ctrl.getIdleAssets);
router.get('/recommendations', ctrl.getRecommendations);
router.get('/warranty-reminders', ctrl.getWarrantyReminders);
router.get('/cost-savings', ctrl.getCostSavings);
router.get('/assets/:id/passport', [param('id').isMongoId()], validate, ctrl.getAssetPassport);
router.get('/assets/:id/timeline', [param('id').isMongoId()], validate, ctrl.getAssetTimeline);

module.exports = router;
