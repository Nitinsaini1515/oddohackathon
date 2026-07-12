const Asset = require('../models/Asset.model');
const Maintenance = require('../models/Maintenance.model');
const Allocation = require('../models/Allocation.model').Allocation;

const getAgeBadge = (purchaseDate) => {
  if (!purchaseDate) return { label: 'Unknown', years: 0, color: 'gray' };
  const years = (Date.now() - new Date(purchaseDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  if (years < 1) return { label: 'New', years: Math.floor(years * 12), unit: 'months', color: 'green' };
  if (years < 3) return { label: 'Young', years: Math.floor(years), unit: 'years', color: 'blue' };
  if (years < 5) return { label: 'Mature', years: Math.floor(years), unit: 'years', color: 'amber' };
  return { label: 'Legacy', years: Math.floor(years), unit: 'years', color: 'red' };
};

const calculateHealthScore = (asset, maintenanceRecords = []) => {
  let score = 100;
  const conditionPenalty = { New: 0, Good: 5, Fair: 15, Poor: 30, Broken: 50 };
  score -= conditionPenalty[asset.condition] || 0;
  score -= Math.min(maintenanceRecords.length * 5, 30);
  if (asset.warrantyExpiry && new Date(asset.warrantyExpiry) < new Date()) score -= 10;
  return Math.max(0, Math.min(100, score));
};

const calculateReliabilityScore = (asset, maintenanceRecords = []) => {
  const resolved = maintenanceRecords.filter((m) => m.status === 'Resolved').length;
  const critical = maintenanceRecords.filter((m) => m.priority === 'Critical').length;
  let score = 100 - critical * 15 - (maintenanceRecords.length - resolved) * 8;
  score += Math.min(asset.allocationCount * 2, 10);
  return Math.max(0, Math.min(100, score));
};

const getAssetPassport = async (assetId) => {
  const asset = await Asset.findById(assetId)
    .populate('categoryId', 'name code icon')
    .populate('currentHolderId', 'name email department')
    .populate('departmentId', 'name code');

  if (!asset) return null;

  const maintenanceRecords = await Maintenance.find({ assetId }).sort({ createdAt: -1 });
  const allocations = await Allocation.find({ assetId }).populate('employeeId', 'name email').sort({ createdAt: -1 });

  return {
    asset,
    ageBadge: getAgeBadge(asset.purchaseDate),
    healthScore: calculateHealthScore(asset, maintenanceRecords),
    reliabilityScore: calculateReliabilityScore(asset, maintenanceRecords),
    maintenanceHistory: maintenanceRecords,
    allocationHistory: allocations,
    warrantyStatus: asset.warrantyExpiry
      ? { expiry: asset.warrantyExpiry, isExpired: new Date(asset.warrantyExpiry) < new Date() }
      : null,
  };
};

const getAssetTimeline = async (assetId) => {
  const asset = await Asset.findById(assetId);
  if (!asset) return null;

  const maintenance = await Maintenance.find({ assetId }).select('title status requestDate timeline createdAt');
  const allocations = await Allocation.find({ assetId }).select('status allocatedDate actualReturnDate history createdAt');

  const events = [];

  asset.history.forEach((h) => {
    events.push({ type: 'history', date: h.date, title: h.event, notes: h.notes, user: h.user });
  });

  maintenance.forEach((m) => {
    events.push({ type: 'maintenance', date: m.requestDate, title: m.title, status: m.status });
    m.timeline.forEach((t) => {
      events.push({ type: 'maintenance_update', date: t.date, title: t.status, notes: t.notes });
    });
  });

  allocations.forEach((a) => {
    events.push({ type: 'allocation', date: a.allocatedDate, title: `Allocation ${a.status}`, status: a.status });
  });

  return events.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const getIdleAssets = async (idleDays = 30) => {
  const cutoff = new Date(Date.now() - idleDays * 24 * 60 * 60 * 1000);
  return Asset.find({
    isDeleted: false,
    status: 'Available',
    $or: [{ lastUsedAt: { $lt: cutoff } }, { lastUsedAt: null }],
  }).populate('categoryId', 'name code');
};

const getSmartRecommendations = async (departmentId) => {
  const query = { isDeleted: false, status: 'Available' };
  if (departmentId) query.departmentId = departmentId;

  const available = await Asset.find(query)
    .populate('categoryId', 'name')
    .sort({ healthScore: -1, reliabilityScore: -1 })
    .limit(10);

  return available.map((a) => ({
    asset: a,
    reason: a.healthScore >= 80 ? 'High health score, ready for deployment' : 'Available asset matching department needs',
    score: Math.round((a.healthScore + a.reliabilityScore) / 2),
  }));
};

const getWarrantyReminders = async (daysAhead = 30) => {
  const now = new Date();
  const future = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  return Asset.find({
    isDeleted: false,
    warrantyExpiry: { $gte: now, $lte: future },
  }).populate('categoryId', 'name').sort({ warrantyExpiry: 1 });
};

const getCostSavings = async () => {
  const idleAssets = await getIdleAssets(30);
  const idleValue = idleAssets.reduce((sum, a) => sum + (a.purchaseCost || 0), 0);

  const reusedCount = await Allocation.countDocuments({ status: 'Returned' });
  const avgCost = await Asset.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: null, avg: { $avg: '$purchaseCost' } } },
  ]);

  const avg = avgCost[0]?.avg || 0;
  const reuseSavings = reusedCount * avg * 0.4;

  return {
    idleAssetCount: idleAssets.length,
    idleCapitalValue: idleValue,
    reuseSavings: Math.round(reuseSavings),
    totalPotentialSavings: Math.round(idleValue * 0.3 + reuseSavings),
  };
};

module.exports = {
  getAgeBadge,
  calculateHealthScore,
  calculateReliabilityScore,
  getAssetPassport,
  getAssetTimeline,
  getIdleAssets,
  getSmartRecommendations,
  getWarrantyReminders,
  getCostSavings,
};
