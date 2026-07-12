const Maintenance = require('../models/Maintenance.model');
const Asset = require('../models/Asset.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { addAssetHistory } = require('../services/assetHistory.service');
const { createNotification } = require('../services/notification.service');
const { NOTIFICATION_TYPES } = require('../utils/constants');

const addTimeline = (record, status, user, notes) => {
  record.timeline.push({
    date: new Date(),
    status,
    notes: notes || '',
    updatedBy: user._id,
    updatedByName: user.name,
  });
};

const raiseRequest = asyncHandler(async (req, res) => {
  const { assetId, title, description, priority, images } = req.body;

  const asset = await Asset.findOne({ _id: assetId, isDeleted: false });
  if (!asset) throw new ApiError(404, 'Asset not found');

  const record = await Maintenance.create({
    assetId,
    raisedBy: req.user._id,
    title: title || 'Maintenance Request',
    description,
    priority: priority || 'Medium',
    images: images || [],
    timeline: [{
      date: new Date(),
      status: 'Pending',
      notes: 'Maintenance request raised',
      updatedBy: req.user._id,
      updatedByName: req.user.name,
    }],
  });

  asset.maintenanceCount += 1;
  if (asset.status !== 'Allocated') asset.status = 'Under Maintenance';
  addAssetHistory(asset, { event: 'Maintenance Requested', user: req.user.name, userId: req.user._id, notes: description });
  await asset.save();

  const populated = await Maintenance.findById(record._id)
    .populate('assetId', 'name assetTag')
    .populate('raisedBy', 'name email');

  res.status(201).json(new ApiResponse(201, { maintenance: populated }, 'Maintenance request raised'));
});

const getMaintenanceRecords = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.assetId) filter.assetId = req.query.assetId;

  const [records, total] = await Promise.all([
    Maintenance.find(filter)
      .populate('assetId', 'name assetTag serialNumber')
      .populate('raisedBy', 'name email')
      .populate('assignedTechnician', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Maintenance.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, { maintenance: records, pagination: buildPaginationMeta(total, page, limit) }, 'Maintenance records fetched')
  );
});

const approveRequest = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Maintenance record not found');
  if (record.status !== 'Pending') throw new ApiError(400, 'Only pending requests can be approved');

  record.status = 'Approved';
  record.approvedBy = req.user._id;
  addTimeline(record, 'Approved', req.user, req.body.notes || 'Request approved');
  await record.save();

  res.status(200).json(new ApiResponse(200, { maintenance: record }, 'Maintenance request approved'));
});

const rejectRequest = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Maintenance record not found');
  if (record.status !== 'Pending') throw new ApiError(400, 'Only pending requests can be rejected');

  record.status = 'Rejected';
  record.rejectedBy = req.user._id;
  record.rejectionReason = req.body.reason || 'Rejected';
  addTimeline(record, 'Rejected', req.user, req.body.reason);

  const asset = await Asset.findById(record.assetId);
  if (asset && asset.status === 'Under Maintenance') asset.status = 'Available';
  if (asset) await asset.save();

  await record.save();
  res.status(200).json(new ApiResponse(200, { maintenance: record }, 'Maintenance request rejected'));
});

const assignTechnician = asyncHandler(async (req, res) => {
  const { technicianId } = req.body;
  const record = await Maintenance.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Maintenance record not found');

  record.assignedTechnician = technicianId;
  addTimeline(record, 'Technician Assigned', req.user, `Assigned to technician`);
  await record.save();

  await createNotification({
    userId: technicianId,
    type: NOTIFICATION_TYPES.MAINTENANCE,
    title: 'Maintenance Assignment',
    message: `You have been assigned a maintenance task: ${record.title}`,
  });

  const populated = await Maintenance.findById(record._id)
    .populate('assignedTechnician', 'name email');

  res.status(200).json(new ApiResponse(200, { maintenance: populated }, 'Technician assigned'));
});

const markInProgress = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Maintenance record not found');

  record.status = 'In Progress';
  addTimeline(record, 'In Progress', req.user, req.body.notes || 'Work started');
  await record.save();

  res.status(200).json(new ApiResponse(200, { maintenance: record }, 'Marked as in progress'));
});

const resolveRequest = asyncHandler(async (req, res) => {
  const record = await Maintenance.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Maintenance record not found');

  record.status = 'Resolved';
  record.resolvedAt = new Date();
  record.resolutionNotes = req.body.notes || 'Issue resolved';
  addTimeline(record, 'Resolved', req.user, req.body.notes);

  const asset = await Asset.findById(record.assetId);
  if (asset) {
    asset.status = asset.currentHolderId ? 'Allocated' : 'Available';
    addAssetHistory(asset, { event: 'Maintenance Resolved', user: req.user.name, userId: req.user._id, notes: req.body.notes });
    await asset.save();
  }

  await record.save();
  res.status(200).json(new ApiResponse(200, { maintenance: record }, 'Maintenance resolved'));
});

const getMaintenanceHistory = asyncHandler(async (req, res) => {
  const records = await Maintenance.find({ assetId: req.params.assetId })
    .populate('raisedBy', 'name')
    .populate('assignedTechnician', 'name')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, { history: records }, 'Maintenance history fetched'));
});

module.exports = {
  raiseRequest,
  getMaintenanceRecords,
  approveRequest,
  rejectRequest,
  assignTechnician,
  markInProgress,
  resolveRequest,
  getMaintenanceHistory,
};
