const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/department.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  body('name').trim().notEmpty(),
  body('code').trim().notEmpty().isLength({ max: 10 }),
  body('budget').optional().isNumeric(),
], validate, ctrl.createDepartment);

router.get('/', ctrl.getDepartments);
router.get('/:id', [param('id').isMongoId()], validate, ctrl.getDepartmentById);

router.put('/:id', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  param('id').isMongoId(),
  body('name').optional().trim().notEmpty(),
  body('code').optional().trim().notEmpty(),
], validate, ctrl.updateDepartment);

router.delete('/:id', authorize(ROLES.ADMIN), [param('id').isMongoId()], validate, ctrl.deleteDepartment);

module.exports = router;
