const crypto = require('crypto');
const User = require('../models/User.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt.util');
const { ROLES } = require('../utils/constants');

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  departmentId: user.departmentId,
  phone: user.phone,
  avatar: user.avatar,
  status: user.status,
  isActive: user.isActive,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const generateAuthTokens = async (user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, department } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email is already registered');
  }

  const assignedRole = ROLES.EMPLOYEE;

  const user = await User.create({
    name,
    email,
    password,
    department: department || null,
    role: assignedRole,
  });

  const { accessToken, refreshToken } = await generateAuthTokens(user);

  res.status(201).json(
    new ApiResponse(201, {
      user: formatUserResponse(user),
      accessToken,
      refreshToken,
    }, 'Registration successful')
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated. Contact administrator.');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  user.lastLogin = new Date();
  const { accessToken, refreshToken } = await generateAuthTokens(user);

  res.status(200).json(
    new ApiResponse(200, {
      user: formatUserResponse(user),
      accessToken,
      refreshToken,
    }, 'Login successful')
  );
});

const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+refreshToken');

  if (user) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json(new ApiResponse(200, null, 'Logout successful'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated');
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(200, {
      accessToken,
      refreshToken: newRefreshToken,
    }, 'Token refreshed successfully')
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select(
    '+passwordResetOtp +passwordResetOtpExpires'
  );

  if (!user) {
    throw new ApiError(404, 'No account found with this email address');
  }

  const otp = user.generatePasswordResetOtp();
  await user.save({ validateBeforeSave: false });

  const responseData = {
    message: 'OTP sent to your email address',
    expiresInMinutes: 10,
  };

  if (process.env.NODE_ENV === 'development') {
    responseData.devOtp = otp;
  }

  res.status(200).json(new ApiResponse(200, responseData, 'Password reset OTP sent'));
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({ email }).select(
    '+passwordResetOtp +passwordResetOtpExpires +passwordResetToken +passwordResetExpires'
  );

  if (!user) {
    throw new ApiError(404, 'No account found with this email address');
  }

  if (!user.passwordResetOtp || user.passwordResetOtp !== hashedOtp) {
    throw new ApiError(400, 'Invalid OTP');
  }

  if (user.passwordResetOtpExpires < Date.now()) {
    throw new ApiError(400, 'OTP has expired. Please request a new one.');
  }

  const resetToken = user.generatePasswordResetToken();
  user.passwordResetOtp = undefined;
  user.passwordResetOtpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(200, {
      resetToken,
      expiresInMinutes: 30,
    }, 'OTP verified successfully')
  );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password +passwordResetToken +passwordResetExpires +refreshToken');

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  user.password = password;
  user.clearPasswordResetFields();
  user.refreshToken = null;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Password reset successful'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { user: formatUserResponse(req.user) }, 'User fetched successfully')
  );
});

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getCurrentUser,
};
