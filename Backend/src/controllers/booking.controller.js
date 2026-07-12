const { Resource, Booking } = require('../models/Booking.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const checkOverlap = async (resourceId, startDate, endDate, excludeId = null) => {
  const filter = {
    resourceId,
    status: { $ne: 'Cancelled' },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
    ],
  };
  if (excludeId) filter._id = { $ne: excludeId };

  const overlap = await Booking.findOne(filter);
  if (overlap) throw new ApiError(409, 'Booking overlaps with an existing reservation');
};

const createResource = asyncHandler(async (req, res) => {
  const resource = await Resource.create(req.body);
  res.status(201).json(new ApiResponse(201, { resource }, 'Resource created'));
});

const getResources = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;
  const resources = await Resource.find(filter).sort({ name: 1 });
  res.status(200).json(new ApiResponse(200, { resources }, 'Resources fetched'));
});

const createBooking = asyncHandler(async (req, res) => {
  const { resourceId, assetId, startDate, endDate, startTime, endTime, purpose, title, departmentId, notes } = req.body;

  const resource = await Resource.findById(resourceId);
  if (!resource) throw new ApiError(404, 'Resource not found');
  if (resource.status !== 'Active') throw new ApiError(400, 'Resource is not available');

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end <= start) throw new ApiError(400, 'End date must be after start date');

  await checkOverlap(resourceId, start, end);

  const booking = await Booking.create({
    resourceId,
    assetId: assetId || resource.assetId || null,
    bookedBy: req.user._id,
    departmentId: departmentId || req.user.departmentId,
    startDate: start,
    endDate: end,
    startTime: startTime || '09:00',
    endTime: endTime || '17:00',
    purpose: purpose || '',
    title: title || resource.name,
    notes: notes || '',
    status: 'Upcoming',
  });

  const populated = await Booking.findById(booking._id)
    .populate('resourceId', 'name type location')
    .populate('bookedBy', 'name email role');

  res.status(201).json(new ApiResponse(201, { booking: populated }, 'Booking created successfully'));
});

const getBookings = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.resourceId) filter.resourceId = req.query.resourceId;
  if (req.query.bookedBy) filter.bookedBy = req.query.bookedBy;

  if (req.query.from || req.query.to) {
    filter.startDate = {};
    if (req.query.from) filter.startDate.$gte = new Date(req.query.from);
    if (req.query.to) filter.startDate.$lte = new Date(req.query.to);
  }

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('resourceId', 'name type')
      .populate('bookedBy', 'name email role')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, { bookings, pagination: buildPaginationMeta(total, page, limit) }, 'Bookings fetched')
  );
});

const getCalendarBookings = asyncHandler(async (req, res) => {
  const m = parseInt(req.query.month, 10) || (new Date().getMonth() + 1);
  const y = parseInt(req.query.year, 10) || new Date().getFullYear();
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59);

  const bookings = await Booking.find({
    status: { $ne: 'Cancelled' },
    startDate: { $lte: end },
    endDate: { $gte: start },
  })
    .populate('resourceId', 'name type')
    .populate('bookedBy', 'name');

  res.status(200).json(new ApiResponse(200, { bookings, period: { start, end } }, 'Calendar bookings fetched'));
});

const updateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.status === 'Cancelled') throw new ApiError(400, 'Cannot update cancelled booking');
  if (booking.status === 'Completed') throw new ApiError(400, 'Cannot update completed booking');

  const startDate = req.body.startDate ? new Date(req.body.startDate) : booking.startDate;
  const endDate = req.body.endDate ? new Date(req.body.endDate) : booking.endDate;

  if (endDate <= startDate) throw new ApiError(400, 'End date must be after start date');

  if (req.body.startDate || req.body.endDate || req.body.resourceId) {
    await checkOverlap(req.body.resourceId || booking.resourceId, startDate, endDate, booking._id);
  }

  ['purpose', 'title', 'notes', 'startTime', 'endTime', 'status'].forEach((f) => {
    if (req.body[f] !== undefined) booking[f] = req.body[f];
  });
  booking.startDate = startDate;
  booking.endDate = endDate;
  if (req.body.resourceId) booking.resourceId = req.body.resourceId;

  await booking.save();

  const populated = await Booking.findById(booking._id)
    .populate('resourceId', 'name type')
    .populate('bookedBy', 'name email');

  res.status(200).json(new ApiResponse(200, { booking: populated }, 'Booking updated'));
});

const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  booking.status = 'Cancelled';
  await booking.save();

  res.status(200).json(new ApiResponse(200, { booking }, 'Booking cancelled'));
});

module.exports = {
  createResource,
  getResources,
  createBooking,
  getBookings,
  getCalendarBookings,
  updateBooking,
  deleteBooking,
};
