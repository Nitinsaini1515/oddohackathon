const express = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/notification.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', ctrl.getNotifications);
router.get('/unread-count', ctrl.getUnreadCount);
router.post('/', [
  body('title').trim().notEmpty(),
  body('message').trim().notEmpty(),
], validate, ctrl.createNotification);
router.patch('/read-all', ctrl.markAllAsRead);
router.patch('/:id/read', [param('id').isMongoId()], validate, ctrl.markAsRead);
router.delete('/:id', [param('id').isMongoId()], validate, ctrl.deleteNotification);

module.exports = router;
