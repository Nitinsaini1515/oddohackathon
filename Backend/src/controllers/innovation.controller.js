const Asset = require('../models/Asset.model');
const innovationService = require('../services/innovation.service');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const getAssetPassport = asyncHandler(async (req, res) => {
  const passport = await innovationService.getAssetPassport(req.params.id);
  if (!passport) throw new ApiError(404, 'Asset not found');
  res.status(200).json(new ApiResponse(200, passport, 'Asset passport fetched'));
});

const getAssetTimeline = asyncHandler(async (req, res) => {
  const timeline = await innovationService.getAssetTimeline(req.params.id);
  if (!timeline) throw new ApiError(404, 'Asset not found');
  res.status(200).json(new ApiResponse(200, { timeline }, 'Asset timeline fetched'));
});

const getIdleAssets = asyncHandler(async (req, res) => {
  const idleDays = parseInt(req.query.days, 10) || 30;
  const assets = await innovationService.getIdleAssets(idleDays);
  res.status(200).json(new ApiResponse(200, { assets, idleDays }, 'Idle assets fetched'));
});

const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await innovationService.getSmartRecommendations(req.query.departmentId);
  res.status(200).json(new ApiResponse(200, { recommendations }, 'Recommendations fetched'));
});

const getWarrantyReminders = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days, 10) || 30;
  const assets = await innovationService.getWarrantyReminders(days);
  res.status(200).json(new ApiResponse(200, { assets, daysAhead: days }, 'Warranty reminders fetched'));
});

const getCostSavings = asyncHandler(async (req, res) => {
  const savings = await innovationService.getCostSavings();
  res.status(200).json(new ApiResponse(200, savings, 'Cost savings calculated'));
});

const getHealthScores = asyncHandler(async (req, res) => {
  const assets = await Asset.find({ isDeleted: false })
    .populate('categoryId', 'name')
    .select('name assetTag condition healthScore reliabilityScore purchaseDate warrantyExpiry status');

  const enriched = assets.map((a) => ({
    ...a.toObject(),
    ageBadge: innovationService.getAgeBadge(a.purchaseDate),
  }));

  res.status(200).json(new ApiResponse(200, { assets: enriched }, 'Health scores fetched'));
});

module.exports = {
  getAssetPassport,
  getAssetTimeline,
  getIdleAssets,
  getRecommendations,
  getWarrantyReminders,
  getCostSavings,
  getHealthScores,
};
