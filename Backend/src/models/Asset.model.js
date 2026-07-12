const mongoose = require('mongoose');
const { ASSET_STATUS, ASSET_CONDITION } = require('../utils/constants');

const historyEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    event: { type: String, required: true },
    user: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, default: '' },
  },
  { _id: true }
);

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssetCategory',
      required: [true, 'Category is required'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    condition: {
      type: String,
      enum: Object.values(ASSET_CONDITION),
      default: ASSET_CONDITION.NEW,
    },
    status: {
      type: String,
      enum: Object.values(ASSET_STATUS),
      default: ASSET_STATUS.AVAILABLE,
      index: true,
    },
    serialNumber: {
      type: String,
      required: [true, 'Serial number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    assetTag: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: { type: String, trim: true, default: '' },
    purchaseDate: { type: Date, default: Date.now },
    purchaseCost: { type: Number, default: 0, min: 0 },
    warrantyExpiry: { type: Date, default: null },
    currentHolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    image: { type: String, default: null },
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    lifecycle: {
      stage: { type: String, default: 'Registered' },
      registeredAt: { type: Date, default: Date.now },
      retiredAt: { type: Date, default: null },
    },
    history: [historyEntrySchema],
    healthScore: { type: Number, default: 100, min: 0, max: 100 },
    reliabilityScore: { type: Number, default: 100, min: 0, max: 100 },
    lastUsedAt: { type: Date, default: null },
    maintenanceCount: { type: Number, default: 0 },
    allocationCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

assetSchema.index({ name: 'text', assetTag: 'text', serialNumber: 'text', description: 'text' });
assetSchema.index({ categoryId: 1, status: 1 });
assetSchema.index({ warrantyExpiry: 1 });

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
