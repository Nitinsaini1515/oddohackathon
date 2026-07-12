const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/allocation.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post('/allocate', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD), [
  body('assetId').isMongoId(),
  body('employeeId').isMongoId(),
  body('expectedReturnDate').optional().isISO8601(),
], validate, ctrl.allocateAsset);

router.post('/return', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD), [
  body('allocationId').isMongoId(),
], validate, ctrl.returnAsset);

router.post('/transfer', [
  body('assetId').isMongoId(),
  body('targetEmployeeId').isMongoId(),
], validate, ctrl.transferAsset);

router.patch('/transfer/:id/approve', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  param('id').isMongoId(),
], validate, ctrl.approveTransfer);

router.get('/', ctrl.getAllocations);
router.get('/transfers', ctrl.getTransfers);
router.get('/history/:assetId', [param('assetId').isMongoId()], validate, ctrl.getAllocationHistory);

module.exports = router;
