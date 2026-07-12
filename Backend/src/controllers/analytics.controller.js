const analyticsService = require('../services/analytics.service');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const getUtilization = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAssetUtilization();
  res.status(200).json(new ApiResponse(200, data, 'Asset utilization fetched'));
});

const getMostUsed = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const assets = await analyticsService.getMostUsedAssets(limit);
  res.status(200).json(new ApiResponse(200, { assets }, 'Most used assets fetched'));
});

const getLeastUsed = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const assets = await analyticsService.getLeastUsedAssets(limit);
  res.status(200).json(new ApiResponse(200, { assets }, 'Least used assets fetched'));
});

const getDepartmentAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getDepartmentAnalytics();
  res.status(200).json(new ApiResponse(200, { analytics }, 'Department analytics fetched'));
});

module.exports = {
  getUtilization,
  getMostUsed,
  getLeastUsed,
  getDepartmentAnalytics,
};
