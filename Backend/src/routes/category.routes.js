const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  body('name').trim().notEmpty(),
  body('code').trim().notEmpty().isLength({ max: 10 }),
], validate, ctrl.createCategory);

router.get('/', ctrl.getCategories);
router.get('/:id', [param('id').isMongoId()], validate, ctrl.getCategoryById);

router.put('/:id', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  param('id').isMongoId(),
], validate, ctrl.updateCategory);

router.delete('/:id', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  param('id').isMongoId(),
], validate, ctrl.deleteCategory);

module.exports = router;
