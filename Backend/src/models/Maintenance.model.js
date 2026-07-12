const mongoose = require('mongoose');
const { MAINTENANCE_STATUS, MAINTENANCE_PRIORITY } = require('../utils/constants');

const timelineEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    status: { type: String, required: true },
    notes: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedByName: { type: String },
  },
  { _id: true }
);

const maintenanceSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true,
      index: true,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, trim: true, default: 'Maintenance Request' },
    description: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: Object.values(MAINTENANCE_PRIORITY),
      default: MAINTENANCE_PRIORITY.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(MAINTENANCE_STATUS),
      default: MAINTENANCE_STATUS.PENDING,
      index: true,
    },
    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectionReason: { type: String, default: '' },
    resolvedAt: { type: Date, default: null },
    resolutionNotes: { type: String, default: '' },
    images: [{ type: String }],
    requestDate: { type: Date, default: Date.now },
    timeline: [timelineEntrySchema],
  },
  { timestamps: true }
);

maintenanceSchema.index({ assetId: 1, status: 1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
