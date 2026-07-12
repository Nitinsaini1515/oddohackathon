const ROLES = {
  ADMIN: 'Admin',
  ASSET_MANAGER: 'Asset Manager',
  DEPARTMENT_HEAD: 'Department Head',
  EMPLOYEE: 'Employee',
};

const ROLE_LIST = Object.values(ROLES);

const USER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  ON_LEAVE: 'On Leave',
};

const DEPARTMENT_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

const ASSET_STATUS = {
  AVAILABLE: 'Available',
  ALLOCATED: 'Allocated',
  UNDER_MAINTENANCE: 'Under Maintenance',
  RETIRED: 'Retired',
  DISPOSED: 'Disposed',
};

const ASSET_CONDITION = {
  NEW: 'New',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
  BROKEN: 'Broken',
};

const ALLOCATION_STATUS = {
  ACTIVE: 'Active',
  RETURNED: 'Returned',
  TRANSFERRED: 'Transferred',
};

const TRANSFER_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
};

const BOOKING_STATUS = {
  UPCOMING: 'Upcoming',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const MAINTENANCE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

const MAINTENANCE_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

const AUDIT_STATUS = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const VERIFICATION_STATUS = {
  VERIFIED: 'Verified',
  MISSING: 'Missing',
  DAMAGED: 'Damaged',
};

const NOTIFICATION_TYPES = {
  ASSET_ASSIGNED: 'Asset Assigned',
  TRANSFER: 'Transfer Approved',
  BOOKING: 'Booking Reminder',
  MAINTENANCE: 'Maintenance Update',
  AUDIT: 'Audit Alert',
  WARRANTY: 'Warranty Reminder',
  SYSTEM: 'System',
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['*'],
  [ROLES.ASSET_MANAGER]: [
    'assets:read', 'assets:write', 'assets:delete',
    'categories:read', 'categories:write', 'categories:delete',
    'allocations:read', 'allocations:write',
    'bookings:read', 'bookings:write', 'bookings:delete',
    'maintenance:read', 'maintenance:write',
    'audits:read', 'audits:write',
    'reports:read', 'analytics:read',
    'notifications:read', 'notifications:write',
    'departments:read', 'employees:read', 'employees:write',
  ],
  [ROLES.DEPARTMENT_HEAD]: [
    'assets:read', 'allocations:read', 'allocations:write',
    'bookings:read', 'bookings:write',
    'maintenance:read', 'maintenance:write',
    'audits:read', 'reports:read', 'analytics:read',
    'notifications:read', 'departments:read', 'employees:read',
  ],
  [ROLES.EMPLOYEE]: [
    'assets:read', 'bookings:read', 'bookings:write',
    'maintenance:read', 'maintenance:write',
    'notifications:read',
  ],
};

module.exports = {
  ROLES,
  ROLE_LIST,
  USER_STATUS,
  DEPARTMENT_STATUS,
  ASSET_STATUS,
  ASSET_CONDITION,
  ALLOCATION_STATUS,
  TRANSFER_STATUS,
  BOOKING_STATUS,
  MAINTENANCE_STATUS,
  MAINTENANCE_PRIORITY,
  AUDIT_STATUS,
  VERIFICATION_STATUS,
  NOTIFICATION_TYPES,
  ROLE_PERMISSIONS,
};
