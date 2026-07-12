const mongoose = require('mongoose');
const { ALLOCATION_STATUS, TRANSFER_STATUS } = require('../utils/constants');

const allocationHistorySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    performedByName: { type: String },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
    fromEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: true }
);

const allocationSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
      index: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    allocatedDate: { type: Date, default: Date.now },
    expectedReturnDate: { type: Date, default: null },
    actualReturnDate: { type: Date, default: null },
    status: {
      type: String,
      enum: Object.values(ALLOCATION_STATUS),
      default: ALLOCATION_STATUS.ACTIVE,
      index: true,
    },
    notes: { type: String, default: '' },
    history: [allocationHistorySchema],
  },
  { timestamps: true }
);

allocationSchema.index({ assetId: 1, status: 1 });

const transferSchema = new mongoose.Schema(
  {
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    allocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Allocation' },
    sourceEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sourceDepartmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    targetDepartmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    requestDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: Object.values(TRANSFER_STATUS),
      default: TRANSFER_STATUS.PENDING,
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, default: '' },
    completedAt: { type: Date, default: null },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Allocation = mongoose.model('Allocation', allocationSchema);
const Transfer = mongoose.model('Transfer', transferSchema);

module.exports = { Allocation, Transfer };
