const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/audit.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { ROLES, VERIFICATION_STATUS } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  body('cycleName').trim().notEmpty(),
  body('auditorId').isMongoId(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
], validate, ctrl.createAudit);

router.get('/', ctrl.getAudits);
router.get('/:id', [param('id').isMongoId()], validate, ctrl.getAuditById);

router.patch('/:id/assign-auditor', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  param('id').isMongoId(),
  body('auditorId').isMongoId(),
], validate, ctrl.assignAuditor);

router.post('/:id/verify', [
  param('id').isMongoId(),
  body('assetId').isMongoId(),
  body('status').isIn(Object.values(VERIFICATION_STATUS)),
], validate, ctrl.verifyAsset);

router.post('/:id/discrepancy-report', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  param('id').isMongoId(),
], validate, ctrl.generateDiscrepancyReport);

module.exports = router;
