const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { ROLES, ROLE_LIST, USER_STATUS } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ROLE_LIST,
      default: ROLES.EMPLOYEE,
    },
    department: {
      type: String,
      trim: true,
      default: null,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
      default: null,
    },
    passwordResetToken: {
      type: String,
      select: false,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
      default: null,
    },
    passwordResetOtp: {
      type: String,
      select: false,
      default: null,
    },
    passwordResetOtpExpires: {
      type: Date,
      select: false,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.passwordResetOtp;
        delete ret.passwordResetOtpExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.index({ role: 1 });
userSchema.index({ department: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generatePasswordResetOtp = function generatePasswordResetOtp() {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  this.passwordResetOtp = crypto.createHash('sha256').update(otp).digest('hex');
  this.passwordResetOtpExpires = Date.now() + 10 * 60 * 1000;
  return otp;
};

userSchema.methods.generatePasswordResetToken = function generatePasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

userSchema.methods.clearPasswordResetFields = function clearPasswordResetFields() {
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
  this.passwordResetOtp = undefined;
  this.passwordResetOtpExpires = undefined;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
