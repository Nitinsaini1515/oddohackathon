const AssetCategory = require('../models/AssetCategory.model');
const Asset = require('../models/Asset.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const { getPagination, buildPaginationMeta } = require('../utils/pagination');

const enrichCategory = async (category) => {
  const itemCount = await Asset.countDocuments({ categoryId: category._id, isDeleted: false });
  const assets = await Asset.find({ categoryId: category._id, isDeleted: false }).select('purchaseCost');
  const totalValue = assets.reduce((s, a) => s + (a.purchaseCost || 0), 0);

  return {
    ...category.toObject(),
    itemCount,
    totalValue,
  };
};

const createCategory = asyncHandler(async (req, res) => {
  const { name, code, icon, description, status } = req.body;

  const existing = await AssetCategory.findOne({ $or: [{ name }, { code: code.toUpperCase() }] });
  if (existing) {
    throw new ApiError(409, existing.name === name ? 'Category name already exists' : 'Category code already exists');
  }

  const category = await AssetCategory.create({
    name,
    code: code.toUpperCase(),
    icon: icon || 'Package',
    description: description || '',
    status: status || 'Active',
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, { category: await enrichCategory(category) }, 'Category created successfully'));
});

const getCategories = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { code: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [categories, total] = await Promise.all([
    AssetCategory.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    AssetCategory.countDocuments(filter),
  ]);

  const enriched = await Promise.all(categories.map(enrichCategory));

  res.status(200).json(
    new ApiResponse(200, { categories: enriched, pagination: buildPaginationMeta(total, page, limit) }, 'Categories fetched successfully')
  );
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await AssetCategory.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  res.status(200).json(new ApiResponse(200, { category: await enrichCategory(category) }, 'Category fetched successfully'));
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await AssetCategory.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  const { name, code, icon, description, status } = req.body;

  if (name && name !== category.name) {
    const dup = await AssetCategory.findOne({ name, _id: { $ne: category._id } });
    if (dup) throw new ApiError(409, 'Category name already exists');
    category.name = name;
  }

  if (code && code.toUpperCase() !== category.code) {
    const dup = await AssetCategory.findOne({ code: code.toUpperCase(), _id: { $ne: category._id } });
    if (dup) throw new ApiError(409, 'Category code already exists');
    category.code = code.toUpperCase();
  }

  if (icon) category.icon = icon;
  if (description !== undefined) category.description = description;
  if (status) category.status = status;

  await category.save();
  res.status(200).json(new ApiResponse(200, { category: await enrichCategory(category) }, 'Category updated successfully'));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await AssetCategory.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  const assetCount = await Asset.countDocuments({ categoryId: category._id, isDeleted: false });
  if (assetCount > 0) {
    throw new ApiError(400, `Cannot delete category with ${assetCount} associated assets`);
  }

  await category.deleteOne();
  res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
