const express = require('express');
const { body, param } = require('express-validator');
const {
  register, login, logout, refreshAccessToken,
  forgotPassword, verifyOtp, resetPassword, getCurrentUser,
} = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const { ROLE_LIST } = require('../utils/constants');

const router = express.Router();

router.post('/register', authLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
], validate, register);

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], validate, login);

router.post('/refresh-token', [
  body('refreshToken').notEmpty().withMessage('Refresh token required'),
], validate, refreshAccessToken);

router.post('/forgot-password', authLimiter, [
  body('email').isEmail().withMessage('Valid email required'),
], validate, forgotPassword);

router.post('/verify-otp', [
  body('email').isEmail(),
  body('otp').isLength({ min: 4, max: 4 }).isNumeric(),
], validate, verifyOtp);

router.post('/reset-password', [
  body('resetToken').notEmpty(),
  body('password').isLength({ min: 6 }),
], validate, resetPassword);

router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
