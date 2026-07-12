const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/asset.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { upload } = require('../middlewares/upload.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), upload.single('image'), [
  body('name').trim().notEmpty(),
  body('categoryId').isMongoId(),
  body('serialNumber').trim().notEmpty(),
  body('purchaseCost').optional().isNumeric(),
], validate, ctrl.createAsset);

router.get('/search', ctrl.searchAssets);
router.get('/', ctrl.getAssets);
router.get('/:id', [param('id').isMongoId()], validate, ctrl.getAssetById);
router.get('/:id/history', [param('id').isMongoId()], validate, ctrl.getAssetHistory);

router.put('/:id', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), upload.single('image'), [
  param('id').isMongoId(),
], validate, ctrl.updateAsset);

router.delete('/:id', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  param('id').isMongoId(),
], validate, ctrl.deleteAsset);

module.exports = router;
