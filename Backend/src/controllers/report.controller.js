const reportService = require('../services/report.service');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const getAssetReport = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.categoryId) filters.categoryId = req.query.categoryId;
  const report = await reportService.getAssetReport(filters);
  res.status(200).json(new ApiResponse(200, report, 'Asset report generated'));
});

const getDepartmentReport = asyncHandler(async (req, res) => {
  const report = await reportService.getDepartmentReport();
  res.status(200).json(new ApiResponse(200, { report }, 'Department report generated'));
});

const getMaintenanceReport = asyncHandler(async (req, res) => {
  const report = await reportService.getMaintenanceReport();
  res.status(200).json(new ApiResponse(200, report, 'Maintenance report generated'));
});

const getBookingReport = asyncHandler(async (req, res) => {
  const report = await reportService.getBookingReport();
  res.status(200).json(new ApiResponse(200, report, 'Booking report generated'));
});

module.exports = {
  getAssetReport,
  getDepartmentReport,
  getMaintenanceReport,
  getBookingReport,
};
