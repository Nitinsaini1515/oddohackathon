const mongoose = require('mongoose');
const { DEPARTMENT_STATUS } = require('../utils/constants');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Category code is required'],
      trim: true,
      uppercase: true,
      unique: true,
      maxlength: 10,
    },
    icon: {
      type: String,
      default: 'Package',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(DEPARTMENT_STATUS),
      default: DEPARTMENT_STATUS.ACTIVE,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

categorySchema.index({ status: 1 });

const AssetCategory = mongoose.model('AssetCategory', categorySchema);

module.exports = AssetCategory;
