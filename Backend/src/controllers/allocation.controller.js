const Asset = require('../models/Asset.model');
const User = require('../models/User.model');
const { Allocation, Transfer } = require('../models/Allocation.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { addAssetHistory } = require('../services/assetHistory.service');
const { createNotification } = require('../services/notification.service');
const { NOTIFICATION_TYPES } = require('../utils/constants');

const allocateAsset = asyncHandler(async (req, res) => {
  const { assetId, employeeId, expectedReturnDate, notes, departmentId } = req.body;

  const asset = await Asset.findOne({ _id: assetId, isDeleted: false });
  if (!asset) throw new ApiError(404, 'Asset not found');
  if (asset.status === 'Allocated') throw new ApiError(400, 'Asset is already allocated');
  if (asset.status === 'Under Maintenance') throw new ApiError(400, 'Asset is under maintenance');

  const activeAllocation = await Allocation.findOne({ assetId, status: 'Active' });
  if (activeAllocation) throw new ApiError(409, 'Asset has an active allocation. Prevent double allocation.');

  const employee = await User.findById(employeeId);
  if (!employee) throw new ApiError(404, 'Employee not found');

  const allocation = await Allocation.create({
    assetId,
    employeeId,
    departmentId: departmentId || employee.departmentId,
    allocatedBy: req.user._id,
    expectedReturnDate: expectedReturnDate || null,
    notes: notes || '',
    history: [{
      action: 'Allocated',
      performedBy: req.user._id,
      performedByName: req.user.name,
      toEmployeeId: employeeId,
      notes: notes || '',
    }],
  });

  asset.status = 'Allocated';
  asset.currentHolderId = employeeId;
  asset.allocationCount += 1;
  asset.lastUsedAt = new Date();

  addAssetHistory(asset, {
    event: 'Asset Allocated',
    user: req.user.name,
    userId: req.user._id,
    notes: `Assigned to ${employee.name}`,
  });

  await asset.save();

  await createNotification({
    userId: employeeId,
    type: NOTIFICATION_TYPES.ASSET_ASSIGNED,
    title: 'New Asset Assigned',
    message: `${asset.name} (${asset.assetTag}) has been assigned to you.`,
    link: `/assets/${asset._id}`,
  });

  const populated = await Allocation.findById(allocation._id)
    .populate('assetId', 'name assetTag serialNumber')
    .populate('employeeId', 'name email department')
    .populate('allocatedBy', 'name');

  res.status(201).json(new ApiResponse(201, { allocation: populated }, 'Asset allocated successfully'));
});

const returnAsset = asyncHandler(async (req, res) => {
  const { allocationId, notes } = req.body;

  const allocation = await Allocation.findById(allocationId);
  if (!allocation) throw new ApiError(404, 'Allocation not found');
  if (allocation.status !== 'Active') throw new ApiError(400, 'Allocation is not active');

  const asset = await Asset.findById(allocation.assetId);
  if (!asset) throw new ApiError(404, 'Asset not found');

  allocation.status = 'Returned';
  allocation.actualReturnDate = new Date();
  allocation.history.push({
    action: 'Returned',
    performedBy: req.user._id,
    performedByName: req.user.name,
    notes: notes || 'Asset returned',
  });
  await allocation.save();

  asset.status = 'Available';
  asset.currentHolderId = null;

  addAssetHistory(asset, {
    event: 'Asset Returned',
    user: req.user.name,
    userId: req.user._id,
    notes: notes || 'Asset returned to inventory',
  });
  await asset.save();

  res.status(200).json(new ApiResponse(200, { allocation }, 'Asset returned successfully'));
});

const transferAsset = asyncHandler(async (req, res) => {
  const { assetId, targetEmployeeId, notes } = req.body;

  const asset = await Asset.findOne({ _id: assetId, isDeleted: false });
  if (!asset) throw new ApiError(404, 'Asset not found');
  if (asset.status !== 'Allocated') throw new ApiError(400, 'Asset must be allocated to transfer');

  const activeAllocation = await Allocation.findOne({ assetId, status: 'Active' });
  if (!activeAllocation) throw new ApiError(400, 'No active allocation found for this asset');

  const targetEmployee = await User.findById(targetEmployeeId);
  if (!targetEmployee) throw new ApiError(404, 'Target employee not found');

  const transfer = await Transfer.create({
    assetId,
    allocationId: activeAllocation._id,
    sourceEmployeeId: activeAllocation.employeeId,
    targetEmployeeId,
    sourceDepartmentId: activeAllocation.departmentId,
    targetDepartmentId: targetEmployee.departmentId,
    notes: notes || '',
    requestedBy: req.user._id,
    status: 'Pending',
  });

  res.status(201).json(new ApiResponse(201, { transfer }, 'Transfer request created'));
});

const approveTransfer = asyncHandler(async (req, res) => {
  const transfer = await Transfer.findById(req.params.id);
  if (!transfer) throw new ApiError(404, 'Transfer not found');
  if (transfer.status !== 'Pending') throw new ApiError(400, 'Transfer is not pending');

  const allocation = await Allocation.findById(transfer.allocationId);
  const asset = await Asset.findById(transfer.assetId);
  const targetEmployee = await User.findById(transfer.targetEmployeeId);

  allocation.status = 'Transferred';
  allocation.actualReturnDate = new Date();
  allocation.history.push({
    action: 'Transferred Out',
    performedBy: req.user._id,
    performedByName: req.user.name,
    toEmployeeId: transfer.targetEmployeeId,
    notes: transfer.notes,
  });
  await allocation.save();

  const newAllocation = await Allocation.create({
    assetId: transfer.assetId,
    employeeId: transfer.targetEmployeeId,
    departmentId: transfer.targetDepartmentId,
    allocatedBy: req.user._id,
    notes: `Transferred from previous holder. ${transfer.notes}`,
    history: [{
      action: 'Transferred In',
      performedBy: req.user._id,
      performedByName: req.user.name,
      fromEmployeeId: transfer.sourceEmployeeId,
      toEmployeeId: transfer.targetEmployeeId,
      notes: transfer.notes,
    }],
  });

  asset.currentHolderId = transfer.targetEmployeeId;
  asset.lastUsedAt = new Date();

  addAssetHistory(asset, {
    event: 'Asset Transferred',
    user: req.user.name,
    userId: req.user._id,
    notes: `Transferred to ${targetEmployee.name}`,
  });
  await asset.save();

  transfer.status = 'Completed';
  transfer.approvedBy = req.user._id;
  transfer.completedAt = new Date();
  await transfer.save();

  await createNotification({
    userId: transfer.targetEmployeeId,
    type: NOTIFICATION_TYPES.TRANSFER,
    title: 'Transfer Approved',
    message: `${asset.name} has been transferred to you.`,
    link: `/assets/${asset._id}`,
  });

  res.status(200).json(new ApiResponse(200, { transfer, allocation: newAllocation }, 'Transfer completed'));
});

const getAllocations = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.employeeId) filter.employeeId = req.query.employeeId;
  if (req.query.assetId) filter.assetId = req.query.assetId;

  const [allocations, total] = await Promise.all([
    Allocation.find(filter)
      .populate('assetId', 'name assetTag serialNumber status')
      .populate('employeeId', 'name email department')
      .populate('allocatedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Allocation.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, { allocations, pagination: buildPaginationMeta(total, page, limit) }, 'Allocations fetched')
  );
});

const getTransfers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const transfers = await Transfer.find(filter)
    .populate('assetId', 'name assetTag')
    .populate('sourceEmployeeId', 'name email')
    .populate('targetEmployeeId', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, { transfers }, 'Transfers fetched'));
});

const getAllocationHistory = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({ assetId: req.params.assetId })
    .populate('employeeId', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, { history: allocations }, 'Allocation history fetched'));
});

module.exports = {
  allocateAsset,
  returnAsset,
  transferAsset,
  approveTransfer,
  getAllocations,
  getTransfers,
  getAllocationHistory,
};
