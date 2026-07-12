const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/employee.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { ROLES, ROLE_LIST } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('role').optional().isIn(ROLE_LIST),
  body('departmentId').optional().isMongoId(),
], validate, ctrl.createEmployee);

router.get('/', ctrl.getEmployees);
router.get('/:id', [param('id').isMongoId()], validate, ctrl.getEmployeeById);

router.put('/:id', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  param('id').isMongoId(),
  body('email').optional().isEmail(),
  body('role').optional().isIn(ROLE_LIST),
], validate, ctrl.updateEmployee);

router.delete('/:id', authorize(ROLES.ADMIN), [param('id').isMongoId()], validate, ctrl.deleteEmployee);

router.patch('/:id/assign-department', authorize(ROLES.ADMIN, ROLES.ASSET_MANAGER), [
  param('id').isMongoId(),
  body('departmentId').isMongoId(),
], validate, ctrl.assignDepartment);

router.patch('/:id/assign-role', authorize(ROLES.ADMIN), [
  param('id').isMongoId(),
  body('role').isIn(ROLE_LIST),
], validate, ctrl.assignRole);

module.exports = router;
