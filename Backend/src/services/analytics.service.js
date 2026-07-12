const Asset = require('../models/Asset.model');
const Department = require('../models/Department.model');
const { Allocation } = require('../models/Allocation.model');
const { Booking } = require('../models/Booking.model');

const getAssetUtilization = async () => {
  const total = await Asset.countDocuments({ isDeleted: false });
  const allocated = await Asset.countDocuments({ isDeleted: false, status: 'Allocated' });
  const available = await Asset.countDocuments({ isDeleted: false, status: 'Available' });
  const maintenance = await Asset.countDocuments({ isDeleted: false, status: 'Under Maintenance' });

  return {
    total,
    allocated,
    available,
    maintenance,
    utilizationRate: total ? Math.round((allocated / total) * 100) : 0,
  };
};

const getMostUsedAssets = async (limit = 10) => {
  return Asset.find({ isDeleted: false })
    .sort({ allocationCount: -1 })
    .limit(limit)
    .populate('categoryId', 'name code')
    .select('name assetTag allocationCount status categoryId purchaseCost');
};

const getLeastUsedAssets = async (limit = 10) => {
  return Asset.find({ isDeleted: false })
    .sort({ allocationCount: 1, lastUsedAt: 1 })
    .limit(limit)
    .populate('categoryId', 'name code')
    .select('name assetTag allocationCount status categoryId lastUsedAt');
};

const getDepartmentAnalytics = async () => {
  const departments = await Department.find({ status: 'Active' });
  return Promise.all(
    departments.map(async (dept) => {
      const [assets, activeAllocations, bookings] = await Promise.all([
        Asset.countDocuments({ departmentId: dept._id, isDeleted: false }),
        Allocation.countDocuments({ departmentId: dept._id, status: 'Active' }),
        Booking.countDocuments({ departmentId: dept._id }),
      ]);
      const deptAssets = await Asset.find({ departmentId: dept._id, isDeleted: false });
      const totalValue = deptAssets.reduce((s, a) => s + (a.purchaseCost || 0), 0);

      return {
        departmentId: dept._id,
        departmentName: dept.name,
        departmentCode: dept.code,
        assetCount: assets,
        activeAllocations,
        bookingCount: bookings,
        totalAssetValue: totalValue,
        utilizationRate: assets ? Math.round((activeAllocations / assets) * 100) : 0,
      };
    })
  );
};

module.exports = {
  getAssetUtilization,
  getMostUsedAssets,
  getLeastUsedAssets,
  getDepartmentAnalytics,
};
