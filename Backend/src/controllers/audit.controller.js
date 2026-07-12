const Audit = require('../models/Audit.model');
const Asset = require('../models/Asset.model');
const User = require('../models/User.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { VERIFICATION_STATUS } = require('../utils/constants');

const createAudit = asyncHandler(async (req, res) => {
  const { cycleName, auditorId, departmentId, startDate, endDate } = req.body;

  const auditor = await User.findById(auditorId);
  if (!auditor) throw new ApiError(404, 'Auditor not found');

  const audit = await Audit.create({
    cycleName,
    auditorId,
    departmentId: departmentId || null,
    startDate,
    endDate,
    status: 'Scheduled',
    createdBy: req.user._id,
  });

  const populated = await Audit.findById(audit._id)
    .populate('auditorId', 'name email')
    .populate('departmentId', 'name code');

  res.status(201).json(new ApiResponse(201, { audit: populated }, 'Audit cycle created'));
});

const getAudits = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [audits, total] = await Promise.all([
    Audit.find(filter)
      .populate('auditorId', 'name email')
      .populate('departmentId', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Audit.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, { audits, pagination: buildPaginationMeta(total, page, limit) }, 'Audits fetched')
  );
});

const getAuditById = asyncHandler(async (req, res) => {
  const audit = await Audit.findById(req.params.id)
    .populate('auditorId', 'name email')
    .populate('departmentId', 'name code')
    .populate('verifiedAssets.assetId', 'name assetTag serialNumber location');

  if (!audit) throw new ApiError(404, 'Audit not found');

  res.status(200).json(new ApiResponse(200, { audit }, 'Audit fetched'));
});

const assignAuditor = asyncHandler(async (req, res) => {
  const { auditorId } = req.body;
  const audit = await Audit.findById(req.params.id);
  if (!audit) throw new ApiError(404, 'Audit not found');

  const auditor = await User.findById(auditorId);
  if (!auditor) throw new ApiError(404, 'Auditor not found');

  audit.auditorId = auditorId;
  await audit.save();

  res.status(200).json(new ApiResponse(200, { audit }, 'Auditor assigned'));
});

const verifyAsset = asyncHandler(async (req, res) => {
  const { assetId, status, notes } = req.body;
  const audit = await Audit.findById(req.params.id);
  if (!audit) throw new ApiError(404, 'Audit not found');

  const asset = await Asset.findById(assetId);
  if (!asset) throw new ApiError(404, 'Asset not found');

  const validStatuses = Object.values(VERIFICATION_STATUS);
  if (!validStatuses.includes(status)) throw new ApiError(400, 'Invalid verification status');

  const existingIdx = audit.verifiedAssets.findIndex((v) => v.assetId.toString() === assetId);
  const entry = {
    assetId,
    status,
    notes: notes || '',
    verifiedDate: new Date(),
    verifiedBy: req.user._id,
  };

  if (existingIdx >= 0) audit.verifiedAssets[existingIdx] = entry;
  else audit.verifiedAssets.push(entry);

  if (audit.status === 'Scheduled') audit.status = 'In Progress';
  await audit.save();

  res.status(200).json(new ApiResponse(200, { audit }, 'Asset verified'));
});

const generateDiscrepancyReport = asyncHandler(async (req, res) => {
  const audit = await Audit.findById(req.params.id)
    .populate('verifiedAssets.assetId', 'name assetTag location');

  if (!audit) throw new ApiError(404, 'Audit not found');

  const verified = audit.verifiedAssets.filter((v) => v.status === 'Verified').length;
  const missing = audit.verifiedAssets.filter((v) => v.status === 'Missing');
  const damaged = audit.verifiedAssets.filter((v) => v.status === 'Damaged');

  audit.discrepancyReport = {
    generatedAt: new Date(),
    summary: `Verified: ${verified}, Missing: ${missing.length}, Damaged: ${damaged.length}`,
    verifiedCount: verified,
    missingCount: missing.length,
    damagedCount: damaged.length,
  };

  if (audit.status === 'In Progress') audit.status = 'Completed';
  await audit.save();

  res.status(200).json(new ApiResponse(200, {
    report: audit.discrepancyReport,
    missingAssets: missing,
    damagedAssets: damaged,
    audit,
  }, 'Discrepancy report generated'));
});

module.exports = {
  createAudit,
  getAudits,
  getAuditById,
  assignAuditor,
  verifyAsset,
  generateDiscrepancyReport,
};
