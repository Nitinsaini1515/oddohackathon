const mongoose = require('mongoose');
const { AUDIT_STATUS, VERIFICATION_STATUS } = require('../utils/constants');

const verifiedAssetSchema = new mongoose.Schema(
  {
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    status: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      required: true,
    },
    notes: { type: String, default: '' },
    verifiedDate: { type: Date, default: Date.now },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: true }
);

const auditSchema = new mongoose.Schema(
  {
    cycleName: { type: String, required: true, trim: true, index: true },
    auditorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(AUDIT_STATUS),
      default: AUDIT_STATUS.SCHEDULED,
      index: true,
    },
    verifiedAssets: [verifiedAssetSchema],
    discrepancyReport: {
      generatedAt: { type: Date, default: null },
      summary: { type: String, default: '' },
      missingCount: { type: Number, default: 0 },
      damagedCount: { type: Number, default: 0 },
      verifiedCount: { type: Number, default: 0 },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Audit = mongoose.model('Audit', auditSchema);

module.exports = Audit;
