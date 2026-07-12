const AssetCategory = require('../models/AssetCategory.model');
const Asset = require('../models/Asset.model');

const generateAssetTag = async (categoryId) => {
  const category = await AssetCategory.findById(categoryId);
  if (!category) {
    const { ApiError } = require('../utils/ApiError');
    throw new ApiError(404, 'Category not found');
  }

  const prefix = `AST-${category.code}`;
  const count = await Asset.countDocuments({ categoryId });
  const tagNumber = String(count + 1).padStart(3, '0');

  return `${prefix}-${tagNumber}`;
};

module.exports = { generateAssetTag };
