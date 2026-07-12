const User = require('../models/User.model');
const { ApiError } = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/jwt.util');
const { ROLE_PERMISSIONS } = require('../utils/constants');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Account is deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(error);
  }
};

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }

  next();
};

const authorizePermission = (...requiredPermissions) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }

  const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];

  if (userPermissions.includes('*')) {
    return next();
  }

  const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));

  if (!hasPermission) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  authorizePermission,
};
