const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/booking.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(authenticate);

router.post('/resources', [
  body('name').trim().notEmpty(),
  body('type').trim().notEmpty(),
], validate, ctrl.createResource);

router.get('/resources', ctrl.getResources);

router.post('/', [
  body('resourceId').isMongoId(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
], validate, ctrl.createBooking);

router.get('/calendar', ctrl.getCalendarBookings);
router.get('/', ctrl.getBookings);

router.put('/:id', [param('id').isMongoId()], validate, ctrl.updateBooking);
router.delete('/:id', [param('id').isMongoId()], validate, ctrl.deleteBooking);

module.exports = router;
