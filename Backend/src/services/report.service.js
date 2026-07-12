const Asset = require('../models/Asset.model');
const Department = require('../models/Department.model');
const Maintenance = require('../models/Maintenance.model');
const { Booking } = require('../models/Booking.model');
const User = require('../models/User.model');
const { Allocation } = require('../models/Allocation.model');

const getAssetReport = async (filters = {}) => {
  const query = { isDeleted: false, ...filters };
  const assets = await Asset.find(query).populate('categoryId', 'name code').populate('currentHolderId', 'name');
  const byStatus = await Asset.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const byCondition = await Asset.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: '$condition', count: { $sum: 1 } } },
  ]);
  const totalValue = assets.reduce((s, a) => s + (a.purchaseCost || 0), 0);

  return { assets, summary: { total: assets.length, totalValue, byStatus, byCondition } };
};

const getDepartmentReport = async () => {
  const departments = await Department.find().populate('managerId', 'name email');
  const report = await Promise.all(
    departments.map(async (dept) => {
      const employeeCount = await User.countDocuments({ departmentId: dept._id, isActive: true });
      const assetCount = await Asset.countDocuments({ departmentId: dept._id, isDeleted: false });
      const allocatedCount = await Allocation.countDocuments({ departmentId: dept._id, status: 'Active' });
      return {
        department: dept,
        employeeCount,
        assetCount,
        allocatedCount,
      };
    })
  );
  return report;
};

const getMaintenanceReport = async () => {
  const records = await Maintenance.find()
    .populate('assetId', 'name assetTag')
    .populate('raisedBy', 'name')
    .populate('assignedTechnician', 'name')
    .sort({ createdAt: -1 });

  const byStatus = await Maintenance.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const byPriority = await Maintenance.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  return { records, summary: { total: records.length, byStatus, byPriority } };
};

const getBookingReport = async () => {
  const bookings = await Booking.find()
    .populate('resourceId', 'name type')
    .populate('bookedBy', 'name email')
    .sort({ startDate: -1 });

  const byStatus = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  return { bookings, summary: { total: bookings.length, byStatus } };
};

module.exports = {
  getAssetReport,
  getDepartmentReport,
  getMaintenanceReport,
  getBookingReport,
};
