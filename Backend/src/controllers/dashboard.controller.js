const Asset = require('../models/Asset.model');
const Department = require('../models/Department.model');
const User = require('../models/User.model');
const Maintenance = require('../models/Maintenance.model');
const { Booking } = require('../models/Booking.model');
const { Allocation } = require('../models/Allocation.model');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalAssets,
    availableAssets,
    allocatedAssets,
    departmentsCount,
    employeesCount,
    maintenanceToday,
    bookingsToday,
    activeAllocations,
  ] = await Promise.all([
    Asset.countDocuments({ isDeleted: false }),
    Asset.countDocuments({ isDeleted: false, status: 'Available' }),
    Asset.countDocuments({ isDeleted: false, status: 'Allocated' }),
    Department.countDocuments({ status: 'Active' }),
    User.countDocuments({ isActive: true }),
    Maintenance.countDocuments({ requestDate: { $gte: today, $lt: tomorrow } }),
    Booking.countDocuments({
      status: 'Upcoming',
      startDate: { $gte: today, $lt: tomorrow },
    }),
    Allocation.countDocuments({ status: 'Active' }),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      totalAssets,
      availableAssets,
      allocatedAssets,
      departmentsCount,
      employeesCount,
      maintenanceToday,
      bookingsToday,
      activeAllocations,
    }, 'Dashboard stats fetched')
  );
});

const getRecentActivity = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

  const [recentAssets, recentMaintenance, recentAllocations] = await Promise.all([
    Asset.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(limit).select('name assetTag createdAt createdBy'),
    Maintenance.find().sort({ createdAt: -1 }).limit(limit).select('title status requestDate raisedBy'),
    Allocation.find().sort({ createdAt: -1 }).limit(limit).select('status allocatedDate assetId employeeId'),
  ]);

  const activities = [];

  recentAssets.forEach((a) => {
    activities.push({
      type: 'registration',
      title: 'New Asset Registered',
      desc: `${a.name} (${a.assetTag}) logged in inventory`,
      time: a.createdAt,
    });
  });

  recentMaintenance.forEach((m) => {
    activities.push({
      type: 'maintenance',
      title: 'Maintenance Request',
      desc: m.title,
      time: m.requestDate,
    });
  });

  recentAllocations.forEach((a) => {
    activities.push({
      type: 'allocation',
      title: `Allocation ${a.status}`,
      desc: `Asset allocation updated`,
      time: a.allocatedDate,
    });
  });

  activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  res.status(200).json(
    new ApiResponse(200, { activities: activities.slice(0, limit) }, 'Recent activity fetched')
  );
});

module.exports = { getDashboardStats, getRecentActivity };
