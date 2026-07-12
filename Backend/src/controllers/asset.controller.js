const Asset = require('../models/Asset.model');
const AssetCategory = require('../models/AssetCategory.model');
const Maintenance = require('../models/Maintenance.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');
const { generateAssetTag } = require('../services/assetTag.service');
const { addAssetHistory } = require('../services/assetHistory.service');
const { calculateHealthScore, calculateReliabilityScore, getAgeBadge } = require('../services/innovation.service');

const formatAsset = async (asset) => {
  const maintenanceRecords = await Maintenance.find({ assetId: asset._id });
  const obj = asset.toObject ? asset.toObject() : asset;
  return {
    ...obj,
    id: obj._id,
    category: obj.categoryId?.name || null,
    ageBadge: getAgeBadge(obj.purchaseDate),
    healthScore: calculateHealthScore(obj, maintenanceRecords),
    reliabilityScore: calculateReliabilityScore(obj, maintenanceRecords),
  };
};

const createAsset = asyncHandler(async (req, res) => {
  const {
    name, categoryId, location, condition, serialNumber, description,
    purchaseDate, purchaseCost, warrantyExpiry, departmentId, specifications, image,
  } = req.body;

  const category = await AssetCategory.findById(categoryId);
  if (!category) throw new ApiError(404, 'Category not found');

  const existingSerial = await Asset.findOne({ serialNumber: serialNumber.toUpperCase(), isDeleted: false });
  if (existingSerial) throw new ApiError(409, 'Serial number already exists');

  const assetTag = await generateAssetTag(categoryId);
  const imagePath = req.file ? `/uploads/${req.file.filename}` : image || null;

  const asset = await Asset.create({
    name,
    categoryId,
    location: location || '',
    condition: condition || 'New',
    status: 'Available',
    serialNumber: serialNumber.toUpperCase(),
    assetTag,
    description: description || '',
    purchaseDate: purchaseDate || new Date(),
    purchaseCost: purchaseCost || 0,
    warrantyExpiry: warrantyExpiry || null,
    departmentId: departmentId || null,
    specifications: specifications || {},
    image: imagePath,
    createdBy: req.user._id,
    lifecycle: { stage: 'Registered', registeredAt: new Date() },
  });

  addAssetHistory(asset, {
    event: 'Asset Registered',
    user: req.user.name,
    userId: req.user._id,
    notes: 'Asset registered in system',
  });
  await asset.save();

  const populated = await Asset.findById(asset._id)
    .populate('categoryId', 'name code icon')
    .populate('currentHolderId', 'name email')
    .populate('departmentId', 'name code');

  res.status(201).json(new ApiResponse(201, { asset: await formatAsset(populated) }, 'Asset registered successfully'));
});

const getAssets = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { isDeleted: false };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.condition) filter.condition = req.query.condition;
  if (req.query.categoryId) filter.categoryId = req.query.categoryId;
  if (req.query.departmentId) filter.departmentId = req.query.departmentId;
  if (req.query.location) filter.location = { $regex: req.query.location, $options: 'i' };

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const sort = req.query.sort || '-createdAt';

  const [assets, total] = await Promise.all([
    Asset.find(filter)
      .populate('categoryId', 'name code icon')
      .populate('currentHolderId', 'name email department')
      .populate('departmentId', 'name code')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Asset.countDocuments(filter),
  ]);

  const formatted = await Promise.all(assets.map(formatAsset));

  res.status(200).json(
    new ApiResponse(200, { assets: formatted, pagination: buildPaginationMeta(total, page, limit) }, 'Assets fetched successfully')
  );
});

const getAssetById = asyncHandler(async (req, res) => {
  const asset = await Asset.findOne({ _id: req.params.id, isDeleted: false })
    .populate('categoryId', 'name code icon')
    .populate('currentHolderId', 'name email department phone')
    .populate('departmentId', 'name code');

  if (!asset) throw new ApiError(404, 'Asset not found');

  res.status(200).json(new ApiResponse(200, { asset: await formatAsset(asset) }, 'Asset fetched successfully'));
});

const updateAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findOne({ _id: req.params.id, isDeleted: false });
  if (!asset) throw new ApiError(404, 'Asset not found');

  const fields = ['name', 'location', 'condition', 'description', 'purchaseDate', 'purchaseCost', 'warrantyExpiry', 'departmentId', 'specifications', 'status'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) asset[field] = req.body[field];
  });

  if (req.body.categoryId) {
    const category = await AssetCategory.findById(req.body.categoryId);
    if (!category) throw new ApiError(404, 'Category not found');
    asset.categoryId = req.body.categoryId;
  }

  if (req.body.serialNumber && req.body.serialNumber.toUpperCase() !== asset.serialNumber) {
    const dup = await Asset.findOne({ serialNumber: req.body.serialNumber.toUpperCase(), isDeleted: false, _id: { $ne: asset._id } });
    if (dup) throw new ApiError(409, 'Serial number already exists');
    asset.serialNumber = req.body.serialNumber.toUpperCase();
  }

  if (req.file) asset.image = `/uploads/${req.file.filename}`;
  else if (req.body.image !== undefined) asset.image = req.body.image;

  addAssetHistory(asset, {
    event: 'Asset Updated',
    user: req.user.name,
    userId: req.user._id,
    notes: req.body.updateNotes || 'Asset details updated',
  });

  await asset.save();

  const populated = await Asset.findById(asset._id)
    .populate('categoryId', 'name code icon')
    .populate('currentHolderId', 'name email')
    .populate('departmentId', 'name code');

  res.status(200).json(new ApiResponse(200, { asset: await formatAsset(populated) }, 'Asset updated successfully'));
});

const deleteAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findOne({ _id: req.params.id, isDeleted: false });
  if (!asset) throw new ApiError(404, 'Asset not found');

  if (asset.status === 'Allocated') {
    throw new ApiError(400, 'Cannot delete an allocated asset. Return it first.');
  }

  asset.isDeleted = true;
  asset.status = 'Disposed';
  asset.lifecycle.stage = 'Disposed';
  asset.lifecycle.retiredAt = new Date();

  addAssetHistory(asset, {
    event: 'Asset Deleted',
    user: req.user.name,
    userId: req.user._id,
    notes: 'Asset soft-deleted from inventory',
  });

  await asset.save();
  res.status(200).json(new ApiResponse(200, null, 'Asset deleted successfully'));
});

const getAssetHistory = asyncHandler(async (req, res) => {
  const asset = await Asset.findOne({ _id: req.params.id, isDeleted: false }).select('history name assetTag');
  if (!asset) throw new ApiError(404, 'Asset not found');

  res.status(200).json(new ApiResponse(200, { history: asset.history, assetTag: asset.assetTag, name: asset.name }, 'Asset history fetched'));
});

const searchAssets = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) throw new ApiError(400, 'Search query is required');

  const assets = await Asset.find({
    isDeleted: false,
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { assetTag: { $regex: q, $options: 'i' } },
      { serialNumber: { $regex: q, $options: 'i' } },
      { location: { $regex: q, $options: 'i' } },
    ],
  })
    .populate('categoryId', 'name code')
    .limit(20);

  const formatted = await Promise.all(assets.map(formatAsset));
  res.status(200).json(new ApiResponse(200, { assets: formatted }, 'Search results'));
});

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  getAssetHistory,
  searchAssets,
};
