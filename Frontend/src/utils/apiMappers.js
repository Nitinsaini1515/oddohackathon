export const parseNumericValue = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseInt(String(val).replace(/[^0-9]/g, ''), 10) || 0;
};

export const formatCurrency = (val) => {
  if (typeof val === 'string' && val.startsWith('$')) return val;
  const num = typeof val === 'number' ? val : parseNumericValue(val);
  return `$${num.toLocaleString()}`;
};

export const mapDepartment = (d) => ({
  id: d._id || d.id,
  name: d.name,
  code: d.code,
  manager: d.managerId?.name || d.manager || 'Unassigned',
  managerId: d.managerId?._id || d.managerId || null,
  employeeCount: d.employeeCount ?? 0,
  status: d.status || 'Active',
  budget: formatCurrency(d.budget),
  description: d.description || '',
});

export const mapEmployee = (e) => ({
  id: e.id || e._id,
  name: e.name,
  email: e.email,
  department: e.department || e.departmentId?.name || '',
  departmentId: e.departmentId?._id || e.departmentId || null,
  role: e.role,
  status: e.status || 'Active',
  avatar: e.avatar || e.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
  phone: e.phone || '',
  joiningDate: e.joiningDate ? String(e.joiningDate).split('T')[0] : '',
  assignedAssetsCount: e.assignedAssetsCount ?? 0,
});

export const mapCategory = (c) => ({
  id: c._id || c.id,
  name: c.name,
  code: c.code,
  icon: c.icon || 'Package',
  itemCount: c.itemCount ?? 0,
  totalValue: formatCurrency(c.totalValue ?? 0),
  status: c.status || 'Active',
  description: c.description || '',
});

export const mapAsset = (a) => ({
  id: a._id || a.id,
  name: a.name,
  category: a.categoryId?.name || a.category || '',
  categoryId: a.categoryId?._id || a.categoryId || null,
  location: a.location || '',
  condition: a.condition || 'New',
  status: a.status || 'Available',
  serialNumber: a.serialNumber,
  assetTag: a.assetTag,
  description: a.description || '',
  purchaseDate: a.purchaseDate ? String(a.purchaseDate).split('T')[0] : '',
  purchaseCost: formatCurrency(a.purchaseCost ?? 0),
  currentHolderId: a.currentHolderId?._id || a.currentHolderId || null,
  image: a.image || null,
  specifications: a.specifications || {},
  healthScore: a.healthScore,
  reliabilityScore: a.reliabilityScore,
  history: (a.history || []).map((h) => ({
    date: h.date ? String(h.date).split('T')[0] : '',
    event: h.event,
    user: h.user,
    notes: h.notes || '',
  })),
});

export const mapAllocation = (a) => ({
  id: a._id || a.id,
  assetId: a.assetId?._id || a.assetId,
  assetName: a.assetId?.name || a.assetName || '',
  assetTag: a.assetId?.assetTag || a.assetTag || '',
  employeeId: a.employeeId?._id || a.employeeId,
  employeeName: a.employeeId?.name || a.employeeName || '',
  department: a.departmentId?.name || a.department || '',
  allocatedDate: a.allocatedDate ? String(a.allocatedDate).split('T')[0] : '',
  expectedReturnDate: a.expectedReturnDate ? String(a.expectedReturnDate).split('T')[0] : null,
  actualReturnDate: a.actualReturnDate ? String(a.actualReturnDate).split('T')[0] : null,
  status: a.status,
  notes: a.notes || '',
});

export const mapTransfer = (t) => ({
  id: t._id || t.id,
  assetId: t.assetId?._id || t.assetId,
  assetName: t.assetId?.name || t.assetName || '',
  assetTag: t.assetId?.assetTag || t.assetTag || '',
  sourceEmployeeId: t.sourceEmployeeId?._id || t.sourceEmployeeId,
  sourceEmployeeName: t.sourceEmployeeId?.name || t.sourceEmployeeName || '',
  targetEmployeeId: t.targetEmployeeId?._id || t.targetEmployeeId,
  targetEmployeeName: t.targetEmployeeId?.name || t.targetEmployeeName || '',
  sourceDepartment: t.sourceDepartmentId?.name || t.sourceDepartment || '',
  targetDepartment: t.targetDepartmentId?.name || t.targetDepartment || '',
  requestDate: t.requestDate ? String(t.requestDate).split('T')[0] : '',
  status: t.status,
  notes: t.notes || '',
});

export const mapBooking = (b) => ({
  id: b._id || b.id,
  resourceId: b.resourceId?._id || b.resourceId,
  resourceName: b.resourceId?.name || b.title || b.resourceName || '',
  resourceType: b.resourceId?.type || b.resourceType || '',
  userName: b.bookedBy?.name || b.userName || '',
  userRole: b.bookedBy?.role || b.userRole || '',
  date: b.startDate ? String(b.startDate).split('T')[0] : '',
  startTime: b.startTime || '09:00',
  endTime: b.endTime || '17:00',
  status: b.status,
});

export const mapMaintenance = (m) => ({
  id: m._id || m.id,
  assetId: m.assetId?._id || m.assetId,
  assetName: m.assetId?.name || m.assetName || '',
  assetTag: m.assetId?.assetTag || m.assetTag || '',
  priority: m.priority,
  description: m.description,
  requestDate: m.requestDate ? String(m.requestDate).split('T')[0] : '',
  status: m.status,
  technician: m.assignedTechnician?.name || m.technician || null,
  images: m.images || [],
  timeline: (m.timeline || []).map((t) => ({
    date: t.date ? String(t.date).split('T')[0] : '',
    status: t.status,
    notes: t.notes || '',
  })),
});

export const mapAudit = (a) => ({
  id: a._id || a.id,
  cycleName: a.cycleName,
  auditorName: a.auditorId?.name || a.auditorName || '',
  startDate: a.startDate ? String(a.startDate).split('T')[0] : '',
  endDate: a.endDate ? String(a.endDate).split('T')[0] : '',
  status: a.status,
  verifiedAssets: (a.verifiedAssets || []).map((v) => ({
    assetId: v.assetId?._id || v.assetId,
    status: v.status,
    notes: v.notes || '',
    verifiedDate: v.verifiedDate ? String(v.verifiedDate).split('T')[0] : '',
  })),
});

export const mapNotification = (n) => ({
  id: n._id || n.id,
  type: n.type,
  title: n.title,
  message: n.message,
  timestamp: n.createdAt || n.timestamp,
  read: n.isRead ?? n.read ?? false,
});

export const mapUser = (u) => ({
  id: u.id || u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  department: u.department || '',
  avatar: u.avatar || u.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U',
  phone: u.phone || '',
  joiningDate: u.joiningDate ? String(u.joiningDate).split('T')[0] : '',
  notifications: u.notifications || {
    emailAlerts: true,
    pushNotifications: false,
    weeklyDigest: true,
  },
});
