const mongoose = require('mongoose');
const { BOOKING_STATUS } = require('../utils/constants');

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    type: { type: String, required: true, trim: true, index: true },
    location: { type: String, trim: true, default: '' },
    capacity: { type: Number, default: 1 },
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', default: null },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

const bookingSchema = new mongoose.Schema(
  {
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
      index: true,
    },
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      default: null,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    title: { type: String, trim: true, default: '' },
    purpose: { type: String, trim: true, default: '' },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    startTime: { type: String, default: '09:00' },
    endTime: { type: String, default: '17:00' },
    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.UPCOMING,
      index: true,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

bookingSchema.index({ resourceId: 1, startDate: 1, endDate: 1 });

const Resource = mongoose.model('Resource', resourceSchema);
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { Resource, Booking };
