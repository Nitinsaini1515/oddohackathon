import api from './api';
import { parseNumericValue } from '../utils/apiMappers';

const getList = (res, key) => res.data.data[key] || [];

export const dataService = {
  getDepartments: () => api.get('/departments?limit=100').then((r) => getList(r, 'departments')),
  createDepartment: (payload) => api.post('/departments', {
    name: payload.name,
    code: payload.code,
    budget: parseNumericValue(payload.budget),
    description: payload.description,
    status: payload.status || 'Active',
  }),
  updateDepartment: (id, payload) => api.put(`/departments/${id}`, {
    name: payload.name,
    code: payload.code,
    budget: parseNumericValue(payload.budget),
    description: payload.description,
    status: payload.status,
  }),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),

  getEmployees: () => api.get('/employees?limit=100').then((r) => getList(r, 'employees')),
  createEmployee: (payload) => api.post('/employees', payload),
  updateEmployee: (id, payload) => api.put(`/employees/${id}`, payload),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),

  getCategories: () => api.get('/categories?limit=100').then((r) => getList(r, 'categories')),
  createCategory: (payload) => api.post('/categories', payload),
  updateCategory: (id, payload) => api.put(`/categories/${id}`, payload),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  getAssets: () => api.get('/assets?limit=100').then((r) => getList(r, 'assets')),
  createAsset: (payload) => api.post('/assets', {
    ...payload,
    purchaseCost: parseNumericValue(payload.purchaseCost),
  }),
  updateAsset: (id, payload) => api.put(`/assets/${id}`, {
    ...payload,
    purchaseCost: payload.purchaseCost !== undefined ? parseNumericValue(payload.purchaseCost) : undefined,
  }),
  deleteAsset: (id) => api.delete(`/assets/${id}`),

  getAllocations: () => api.get('/allocations?limit=100').then((r) => getList(r, 'allocations')),
  allocateAsset: (payload) => api.post('/allocations/allocate', payload),
  returnAsset: (payload) => api.post('/allocations/return', payload),
  getTransfers: () => api.get('/allocations/transfers').then((r) => r.data.data.transfers || []),
  requestTransfer: (payload) => api.post('/allocations/transfer', payload),
  approveTransfer: (id) => api.patch(`/allocations/transfer/${id}/approve`),

  getBookings: () => api.get('/bookings?limit=100').then((r) => getList(r, 'bookings')),
  createBooking: (payload) => api.post('/bookings', payload),
  updateBooking: (id, payload) => api.put(`/bookings/${id}`, payload),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  getResources: () => api.get('/bookings/resources').then((r) => r.data.data.resources || []),
  createResource: (payload) => api.post('/bookings/resources', payload),

  getMaintenance: () => api.get('/maintenance?limit=100').then((r) => getList(r, 'maintenance')),
  raiseMaintenance: (payload) => api.post('/maintenance', payload),
  approveMaintenance: (id, notes) => api.patch(`/maintenance/${id}/approve`, { notes }),
  rejectMaintenance: (id, reason) => api.patch(`/maintenance/${id}/reject`, { reason }),
  assignTechnician: (id, technicianId) => api.patch(`/maintenance/${id}/assign`, { technicianId }),
  progressMaintenance: (id, notes) => api.patch(`/maintenance/${id}/progress`, { notes }),
  resolveMaintenance: (id, notes) => api.patch(`/maintenance/${id}/resolve`, { notes }),

  getAudits: () => api.get('/audits?limit=100').then((r) => getList(r, 'audits')),
  createAudit: (payload) => api.post('/audits', payload),
  verifyAuditAsset: (id, payload) => api.post(`/audits/${id}/verify`, payload),
  generateDiscrepancyReport: (id) => api.post(`/audits/${id}/discrepancy-report`),

  getNotifications: () => api.get('/notifications?limit=50').then((r) => r.data.data),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch('/notifications/read-all'),

  getDashboardStats: () => api.get('/dashboard/stats').then((r) => r.data.data),
  getDashboardActivity: () => api.get('/dashboard/activity').then((r) => r.data.data.activities || []),
};
