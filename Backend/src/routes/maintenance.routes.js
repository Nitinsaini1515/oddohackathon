const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/maintenance.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { ROLES, MAINTENANCE_PRIORITY } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post('/', [
  body('assetId').isMongoId(),
  body('description').trim().notEmpty(),
  body('priority').optional().isIn(Object.values(MAINTENANCE_PRIORITY)),
], validate, ctrl.raiseRequest);

router.get('/', ctrl.getMaintenanceRecords);
router.get('/history/:assetId', [param('assetId').isMongoId()], validate, ctrl.getMaintenanceHistory);

router.patch('/:id/approve', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [param('id').isMongoId()], validate, ctrl.approveRequest);
router.patch('/:id/reject', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [param('id').isMongoId()], validate, ctrl.rejectRequest);
router.patch('/:id/assign', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  param('id').isMongoId(),
  body('technicianId').isMongoId(),
], validate, ctrl.assignTechnician);
router.patch('/:id/progress', [param('id').isMongoId()], validate, ctrl.markInProgress);
router.patch('/:id/resolve', [param('id').isMongoId()], validate, ctrl.resolveRequest);

module.exports = router;
