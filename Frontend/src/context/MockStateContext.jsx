import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initialAssets,
  initialEmployees,
  initialDepartments,
  initialCategories,
  mockActivities,
  initialAllocations,
  initialTransfers,
  initialBookings,
  initialMaintenance,
  initialAudits,
  initialNotifications
} from '../data/mockData';
import { dataService } from '../services/data.service';
import { getStoredToken } from '../services/auth.service';
import { useAuth } from './AuthContext';
import {
  mapDepartment,
  mapEmployee,
  mapCategory,
  mapAsset,
  mapAllocation,
  mapTransfer,
  mapBooking,
  mapMaintenance,
  mapAudit,
  mapNotification,
  mapUser,
} from '../utils/apiMappers';

const MockStateContext = createContext(undefined);

export function MockStateProvider({ children }) {
  const { user: authUser } = useAuth();
  const useApi = () => !!getStoredToken();

  // Load or seed state
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('assetflow_assets');
    return saved ? JSON.parse(saved) : initialAssets;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('assetflow_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('assetflow_departments');
    return saved ? JSON.parse(saved) : initialDepartments;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('assetflow_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('assetflow_activities');
    return saved ? JSON.parse(saved) : mockActivities;
  });

  const [allocations, setAllocations] = useState(() => {
    const saved = localStorage.getItem('assetflow_allocations');
    return saved ? JSON.parse(saved) : initialAllocations;
  });

  const [transfers, setTransfers] = useState(() => {
    const saved = localStorage.getItem('assetflow_transfers');
    return saved ? JSON.parse(saved) : initialTransfers;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('assetflow_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [maintenance, setMaintenance] = useState(() => {
    const saved = localStorage.getItem('assetflow_maintenance');
    return saved ? JSON.parse(saved) : initialMaintenance;
  });

  const [audits, setAudits] = useState(() => {
    const saved = localStorage.getItem('assetflow_audits');
    return saved ? JSON.parse(saved) : initialAudits;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('assetflow_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('assetflow_user');
    return saved ? JSON.parse(saved) : {
      name: 'David Miller',
      email: 'david.m@assetflow.com',
      role: 'IT Manager',
      avatar: 'DM',
      phone: '+1 (555) 019-5821',
      joiningDate: '2022-08-01',
      notifications: {
        emailAlerts: true,
        pushNotifications: false,
        weeklyDigest: true
      }
    };
  });

  const [isLoadingData, setIsLoadingData] = useState(false);

  const loadFromApi = useCallback(async () => {
    if (!getStoredToken()) return;
    setIsLoadingData(true);
    try {
      const [
        depts, emps, cats, assetsList, allocs, transfersList,
        bookingsList, maint, auditsList, notifRes, activities,
      ] = await Promise.all([
        dataService.getDepartments(),
        dataService.getEmployees(),
        dataService.getCategories(),
        dataService.getAssets(),
        dataService.getAllocations(),
        dataService.getTransfers(),
        dataService.getBookings(),
        dataService.getMaintenance(),
        dataService.getAudits(),
        dataService.getNotifications(),
        dataService.getDashboardActivity(),
      ]);

      setDepartments(depts.map(mapDepartment));
      setEmployees(emps.map(mapEmployee));
      setCategories(cats.map(mapCategory));
      setAssets(assetsList.map(mapAsset));
      setAllocations(allocs.map(mapAllocation));
      setTransfers(transfersList.map(mapTransfer));
      setBookings(bookingsList.map(mapBooking));
      setMaintenance(maint.map(mapMaintenance));
      setAudits(auditsList.map(mapAudit));
      setNotifications((notifRes.notifications || []).map(mapNotification));
      setActivities(activities.map((a, i) => ({
        id: `act-${i}`,
        type: a.type || 'status_change',
        title: a.title,
        desc: a.notes || a.title,
        time: a.date ? new Date(a.date).toLocaleDateString() : 'Recently',
        user: a.user || 'System',
      })));
    } catch (error) {
      console.error('Failed to load data from API:', error.message);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      setCurrentUser(mapUser(authUser));
    }
  }, [authUser]);

  useEffect(() => {
    loadFromApi();
    const onAuthChange = () => loadFromApi();
    window.addEventListener('assetflow:auth-change', onAuthChange);
    return () => window.removeEventListener('assetflow:auth-change', onAuthChange);
  }, [loadFromApi]);

  // Sync to local storage when state changes
  useEffect(() => {
    localStorage.setItem('assetflow_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('assetflow_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('assetflow_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('assetflow_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('assetflow_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('assetflow_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('assetflow_allocations', JSON.stringify(allocations));
  }, [allocations]);

  useEffect(() => {
    localStorage.setItem('assetflow_transfers', JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem('assetflow_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('assetflow_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('assetflow_audits', JSON.stringify(audits));
  }, [audits]);

  useEffect(() => {
    localStorage.setItem('assetflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
    }
  }, [authUser]);

  // Log user activity helper
  const logActivity = (type, title, desc) => {
    const newAct = {
      id: `act-${Date.now()}`,
      type,
      title,
      desc,
      time: 'Just now',
      user: currentUser.name
    };
    setActivities(prev => [newAct, ...prev.slice(0, 15)]); // Cap at 15 items
  };

  // --- CRUD Operations ---

  // Assets
  const addAsset = async (asset) => {
    if (useApi()) {
      const cat = categories.find((c) => c.name === asset.category || c.id === asset.categoryId);
      const res = await dataService.createAsset({
        name: asset.name,
        categoryId: cat?.id || asset.categoryId,
        serialNumber: asset.serialNumber,
        location: asset.location,
        condition: asset.condition || 'New',
        description: asset.description,
        purchaseDate: asset.purchaseDate,
        purchaseCost: asset.purchaseCost,
        specifications: asset.specifications,
        image: asset.image,
      });
      const mapped = mapAsset(res.data.data.asset);
      setAssets((prev) => [mapped, ...prev]);
      logActivity('registration', 'New Asset Registered', `${mapped.name} added to database.`);
      return mapped;
    }
    const newAsset = {
      ...asset,
      id: `ast-${Date.now()}`,
      assetTag: asset.assetTag || `AST-${asset.category?.substring(0, 3).toUpperCase() || 'GEN'}-${Math.floor(100 + Math.random() * 900)}`,
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          event: 'Asset Registered',
          user: currentUser.name,
          notes: 'Initial registration into AssetFlow.'
        }
      ]
    };
    setAssets(prev => [newAsset, ...prev]);
    logActivity('registration', 'New Asset Registered', `${newAsset.name} added to database.`);
    
    // Update category count
    setCategories(prevCats => prevCats.map(c => {
      if (c.name === newAsset.category) {
        const numericVal = parseInt(c.totalValue.replace(/[^0-9]/g, '')) + parseInt(newAsset.purchaseCost?.replace(/[^0-9]/g, '') || 0);
        return {
          ...c,
          itemCount: c.itemCount + 1,
          totalValue: `$${numericVal.toLocaleString()}`
        };
      }
      return c;
    }));

    return newAsset;
  };

  const updateAsset = (updated) => {
    setAssets(prev => prev.map(a => {
      if (a.id === updated.id) {
        // Track changes if status or condition modified
        const historyEntries = [];
        if (a.status !== updated.status) {
          historyEntries.push({
            date: new Date().toISOString().split('T')[0],
            event: 'Status Change',
            user: currentUser.name,
            notes: `Status changed from ${a.status} to ${updated.status}.`
          });
        }
        if (a.condition !== updated.condition) {
          historyEntries.push({
            date: new Date().toISOString().split('T')[0],
            event: 'Condition Update',
            user: currentUser.name,
            notes: `Condition changed from ${a.condition} to ${updated.condition}.`
          });
        }
        if (a.currentHolderId !== updated.currentHolderId) {
          const newHolder = employees.find(e => e.id === updated.currentHolderId);
          historyEntries.push({
            date: new Date().toISOString().split('T')[0],
            event: 'Allocation Changed',
            user: currentUser.name,
            notes: newHolder ? `Assigned to ${newHolder.name}.` : 'Asset unassigned.'
          });
        }

        return {
          ...a,
          ...updated,
          history: [...(a.history || []), ...historyEntries]
        };
      }
      return a;
    }));

    // Adjust employee counts if assigned changed
    const originalAsset = assets.find(a => a.id === updated.id);
    if (originalAsset && originalAsset.currentHolderId !== updated.currentHolderId) {
      setEmployees(prevEmp => prevEmp.map(e => {
        if (e.id === originalAsset.currentHolderId) {
          return { ...e, assignedAssetsCount: Math.max(0, e.assignedAssetsCount - 1) };
        }
        if (e.id === updated.currentHolderId) {
          return { ...e, assignedAssetsCount: e.assignedAssetsCount + 1 };
        }
        return e;
      }));
    }

    logActivity('status_change', 'Asset Updated', `${updated.name} properties modified.`);
  };

  const deleteAsset = (id) => {
    const target = assets.find(a => a.id === id);
    if (!target) return;
    setAssets(prev => prev.filter(a => a.id !== id));
    logActivity('status_change', 'Asset Deleted', `${target.name} removed from inventory.`);

    // Decrement employee assigned count if it was assigned
    if (target.currentHolderId) {
      setEmployees(prevEmp => prevEmp.map(e => {
        if (e.id === target.currentHolderId) {
          return { ...e, assignedAssetsCount: Math.max(0, e.assignedAssetsCount - 1) };
        }
        return e;
      }));
    }

    // Decrement category count
    setCategories(prevCats => prevCats.map(c => {
      if (c.name === target.category) {
        const origCost = parseInt(target.purchaseCost?.replace(/[^0-9]/g, '') || 0);
        const origTotal = parseInt(c.totalValue.replace(/[^0-9]/g, '') || 0);
        const finalVal = Math.max(0, origTotal - origCost);
        return {
          ...c,
          itemCount: Math.max(0, c.itemCount - 1),
          totalValue: `$${finalVal.toLocaleString()}`
        };
      }
      return c;
    }));
  };

  // Departments
  const addDepartment = async (dept) => {
    if (useApi()) {
      const res = await dataService.createDepartment(dept);
      const mapped = mapDepartment(res.data.data.department);
      setDepartments((prev) => [...prev, mapped]);
      logActivity('employee', 'Department Created', `New department "${mapped.name}" registered.`);
      return mapped;
    }
    const newDept = {
      ...dept,
      id: `dept-${Date.now()}`,
      employeeCount: 0,
      budget: dept.budget || '$0'
    };
    setDepartments(prev => [...prev, newDept]);
    logActivity('employee', 'Department Created', `New department "${newDept.name}" registered.`);
    return newDept;
  };

  const updateDepartment = async (updated) => {
    if (useApi()) {
      await dataService.updateDepartment(updated.id, updated);
      const res = await dataService.getDepartments();
      setDepartments(res.map(mapDepartment));
      logActivity('employee', 'Department Updated', `Department "${updated.name}" updated.`);
      return;
    }
    setDepartments(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } : d));
    logActivity('employee', 'Department Updated', `Department "${updated.name}" updated.`);
  };

  const deleteDepartment = async (id) => {
    if (useApi()) {
      const target = departments.find((d) => d.id === id);
      await dataService.deleteDepartment(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      if (target) logActivity('employee', 'Department Deleted', `Department "${target.name}" removed.`);
      return;
    }
    const target = departments.find(d => d.id === id);
    if (!target) return;
    setDepartments(prev => prev.filter(d => d.id !== id));
    logActivity('employee', 'Department Deleted', `Department "${target.name}" removed.`);
  };

  // Employees
  const addEmployee = async (emp) => {
    if (useApi()) {
      const dept = departments.find((d) => d.name === emp.department);
      const res = await dataService.createEmployee({
        name: emp.name,
        email: emp.email,
        password: emp.password || 'password123',
        departmentId: dept?.id || emp.departmentId,
        role: emp.role || 'Employee',
        phone: emp.phone,
        status: emp.status || 'Active',
        joiningDate: emp.joiningDate,
      });
      const mapped = mapEmployee(res.data.data.employee);
      setEmployees((prev) => [mapped, ...prev]);
      logActivity('employee', 'Employee Hired', `${mapped.name} registered as ${mapped.role}.`);
      return mapped;
    }
    const newEmp = {
      ...emp,
      id: `emp-${Date.now()}`,
      avatar: emp.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      assignedAssetsCount: 0,
      joiningDate: emp.joiningDate || new Date().toISOString().split('T')[0]
    };
    setEmployees(prev => [newEmp, ...prev]);

    // Update employee count in department
    setDepartments(prevDepts => prevDepts.map(d => {
      if (d.name === newEmp.department) {
        return { ...d, employeeCount: d.employeeCount + 1 };
      }
      return d;
    }));

    logActivity('employee', 'Employee Hired', `${newEmp.name} registered as ${newEmp.role}.`);
    return newEmp;
  };

  const updateEmployee = async (updated) => {
    if (useApi()) {
      const dept = departments.find((d) => d.name === updated.department);
      await dataService.updateEmployee(updated.id, {
        name: updated.name,
        email: updated.email,
        departmentId: dept?.id,
        role: updated.role,
        phone: updated.phone,
        status: updated.status,
      });
      const res = await dataService.getEmployees();
      setEmployees(res.map(mapEmployee));
      logActivity('employee', 'Employee Profile Updated', `${updated.name}'s records updated.`);
      return;
    }
    const original = employees.find(e => e.id === updated.id);
    setEmployees(prev => prev.map(e => e.id === updated.id ? { ...e, ...updated } : e));

    // Handle department employee count transfers
    if (original && original.department !== updated.department) {
      setDepartments(prevDepts => prevDepts.map(d => {
        if (d.name === original.department) {
          return { ...d, employeeCount: Math.max(0, d.employeeCount - 1) };
        }
        if (d.name === updated.department) {
          return { ...d, employeeCount: d.employeeCount + 1 };
        }
        return d;
      }));
    }

    logActivity('employee', 'Employee Profile Updated', `${updated.name}'s records updated.`);
  };

  const deleteEmployee = async (id) => {
    if (useApi()) {
      const target = employees.find((e) => e.id === id);
      await dataService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      if (target) logActivity('employee', 'Employee Removed', `${target.name} database profile deleted.`);
      return;
    }
    const target = employees.find(e => e.id === id);
    if (!target) return;
    setEmployees(prev => prev.filter(e => e.id !== id));

    // Update employee count in department
    setDepartments(prevDepts => prevDepts.map(d => {
      if (d.name === target.department) {
        return { ...d, employeeCount: Math.max(0, d.employeeCount - 1) };
      }
      return d;
    }));

    // Free any assigned assets
    setAssets(prevAssets => prevAssets.map(a => {
      if (a.currentHolderId === id) {
        return {
          ...a,
          currentHolderId: null,
          status: 'Available',
          history: [...(a.history || []), {
            date: new Date().toISOString().split('T')[0],
            event: 'Asset Unassigned',
            user: currentUser.name,
            notes: 'Holder was removed from the database.'
          }]
        };
      }
      return a;
    }));

    logActivity('employee', 'Employee Removed', `${target.name} database profile deleted.`);
  };

  // Categories
  const addCategory = async (cat) => {
    if (useApi()) {
      const res = await dataService.createCategory({
        name: cat.name,
        code: cat.code,
        icon: cat.icon || 'Package',
        description: cat.description,
        status: cat.status || 'Active',
      });
      const mapped = mapCategory(res.data.data.category);
      setCategories((prev) => [...prev, mapped]);
      logActivity('registration', 'Category Added', `New Asset category "${mapped.name}" defined.`);
      return mapped;
    }
    const newCat = {
      ...cat,
      id: `cat-${Date.now()}`,
      itemCount: 0,
      totalValue: '$0'
    };
    setCategories(prev => [...prev, newCat]);
    logActivity('registration', 'Category Added', `New Asset category "${newCat.name}" defined.`);
    return newCat;
  };

  const updateCategory = (updated) => {
    setCategories(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c));
    logActivity('registration', 'Category Updated', `Category "${updated.name}" modified.`);
  };

  const deleteCategory = (id) => {
    const target = categories.find(c => c.id === id);
    if (!target) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    logActivity('registration', 'Category Deleted', `Category "${target.name}" removed.`);
  };

  // --- Transactions / Allocation / Bookings / Maintenance Mutations ---

  // Allocations
  const allocateAsset = (assetId, employeeId, department, expectedReturnDate, notes) => {
    const asset = assets.find(a => a.id === assetId);
    const employee = employees.find(e => e.id === employeeId);
    if (!asset || !employee) return;

    // Update asset status
    updateAsset({
      ...asset,
      status: 'Allocated',
      currentHolderId: employeeId
    });

    // Create allocation entry
    const newAlloc = {
      id: `alc-${Date.now()}`,
      assetId,
      assetName: asset.name,
      assetTag: asset.assetTag,
      employeeId,
      employeeName: employee.name,
      department,
      allocatedDate: new Date().toISOString().split('T')[0],
      expectedReturnDate,
      actualReturnDate: null,
      status: 'Active',
      notes
    };
    setAllocations(prev => [newAlloc, ...prev]);

    // Create Notification
    createNotification('Asset Assigned', 'Asset Allocated', `${asset.name} has been allocated to ${employee.name}.`);
    logActivity('allocation', 'Asset Allocated', `${asset.name} assigned to ${employee.name}.`);
  };

  const returnAsset = (assetId, condition, conditionNotes, damageNotes, mockImage) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    // Update asset
    updateAsset({
      ...asset,
      status: 'Available',
      condition,
      currentHolderId: null
    });

    // Update active allocation
    setAllocations(prev => prev.map(al => {
      if (al.assetId === assetId && al.status === 'Active') {
        return {
          ...al,
          status: 'Returned',
          actualReturnDate: new Date().toISOString().split('T')[0]
        };
      }
      return al;
    }));

    // Create Notification
    createNotification('Asset Returned', 'Asset Returned', `${asset.name} has been returned and marked ${condition}.`);
    logActivity('status_change', 'Asset Returned', `${asset.name} returned by holder.`);
  };

  // Transfers
  const requestTransfer = (assetId, targetEmployeeId, targetDepartment, notes) => {
    const asset = assets.find(a => a.id === assetId);
    const targetEmployee = employees.find(e => e.id === targetEmployeeId);
    if (!asset || !targetEmployee) return;

    const sourceEmployee = employees.find(e => e.id === asset.currentHolderId) || { name: 'Unassigned', id: null };

    const newTransfer = {
      id: `trf-${Date.now()}`,
      assetId,
      assetName: asset.name,
      assetTag: asset.assetTag,
      sourceEmployeeId: sourceEmployee.id,
      sourceEmployeeName: sourceEmployee.name,
      targetEmployeeId,
      targetEmployeeName: targetEmployee.name,
      sourceDepartment: asset.location || 'HQ',
      targetDepartment,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes
    };

    setTransfers(prev => [newTransfer, ...prev]);
    logActivity('status_change', 'Transfer Requested', `Transfer request raised for ${asset.name} to ${targetEmployee.name}.`);
  };

  const approveTransfer = (transferId) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (!transfer) return;

    // Update transfer status
    setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status: 'Approved' } : t));

    // Allocate asset to new employee
    allocateAsset(
      transfer.assetId,
      transfer.targetEmployeeId,
      transfer.targetDepartment,
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      `Approved transfer: ${transfer.notes}`
    );
    
    createNotification('Transfer Approved', 'Transfer Approved', `Transfer of ${transfer.assetName} to ${transfer.targetEmployeeName} was approved.`);
  };

  const rejectTransfer = (transferId) => {
    setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status: 'Rejected' } : t));
    logActivity('status_change', 'Transfer Rejected', `Transfer request rejected.`);
  };

  // Bookings
  const createBooking = (resourceId, resourceName, resourceType, date, startTime, endTime) => {
    // Check overlap validation
    const hasOverlap = bookings.some(b => 
      b.resourceId === resourceId && 
      b.date === date && 
      b.status === 'Upcoming' &&
      ((startTime >= b.startTime && startTime < b.endTime) ||
       (endTime > b.startTime && endTime <= b.endTime) ||
       (startTime <= b.startTime && endTime >= b.endTime))
    );

    if (hasOverlap) {
      throw new Error('Overlap detected! This slot is already booked.');
    }

    const newBooking = {
      id: `bkg-${Date.now()}`,
      resourceId,
      resourceName,
      resourceType,
      userName: currentUser.name,
      userRole: currentUser.role,
      date,
      startTime,
      endTime,
      status: 'Upcoming'
    };

    setBookings(prev => [newBooking, ...prev]);
    createNotification('Booking Reminder', 'Resource Booked', `${resourceName} booked for ${date} at ${startTime}.`);
    logActivity('allocation', 'Resource Booked', `${resourceName} reserved by ${currentUser.name}.`);
    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
    logActivity('status_change', 'Booking Cancelled', `Resource booking cancelled.`);
  };

  const rescheduleBooking = (bookingId, date, startTime, endTime) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Check overlap with other bookings (excluding current booking)
    const hasOverlap = bookings.some(b => 
      b.id !== bookingId &&
      b.resourceId === booking.resourceId && 
      b.date === date && 
      b.status === 'Upcoming' &&
      ((startTime >= b.startTime && startTime < b.endTime) ||
       (endTime > b.startTime && endTime <= b.endTime) ||
       (startTime <= b.startTime && endTime >= b.endTime))
    );

    if (hasOverlap) {
      throw new Error('Overlap detected! This slot is already booked.');
    }

    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      date,
      startTime,
      endTime
    } : b));

    logActivity('status_change', 'Booking Rescheduled', `${booking.resourceName} rescheduled to ${date} ${startTime}.`);
  };

  // Maintenance
  const raiseMaintenance = (assetId, priority, description, image) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    // Set asset state to Under Maintenance
    updateAsset({
      ...asset,
      status: 'Under Maintenance'
    });

    const newReq = {
      id: `mnt-${Date.now()}`,
      assetId,
      assetName: asset.name,
      assetTag: asset.assetTag,
      priority,
      description,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      technician: null,
      images: image ? [image] : [],
      timeline: [
        { date: new Date().toISOString().split('T')[0], status: 'Pending', notes: 'Maintenance ticket raised.' }
      ]
    };

    setMaintenance(prev => [newReq, ...prev]);
    createNotification('Maintenance Reminder', 'Maintenance Raised', `Maintenance ticket raised for ${asset.name}.`);
    logActivity('maintenance', 'Maintenance Raised', `Maintenance ticket raised for ${asset.name}.`);
  };

  const updateMaintenanceStatus = (id, status, notes, technician) => {
    setMaintenance(prev => prev.map(m => {
      if (m.id === id) {
        const nextTimeline = [
          ...(m.timeline || []),
          { date: new Date().toISOString().split('T')[0], status, notes: notes || `State updated to ${status}` }
        ];

        // If status is Resolved, mark asset as Available
        if (status === 'Resolved') {
          const asset = assets.find(a => a.id === m.assetId);
          if (asset) {
            updateAsset({
              ...asset,
              status: 'Available'
            });
          }
        }

        return {
          ...m,
          status,
          technician: technician || m.technician,
          timeline: nextTimeline
        };
      }
      return m;
    }));

    logActivity('maintenance', 'Maintenance Updated', `Ticket state changed to ${status}.`);
  };

  // Audits
  const createAuditCycle = (cycleName, auditorName, startDate, endDate) => {
    const newCycle = {
      id: `aud-${Date.now()}`,
      cycleName,
      auditorName,
      startDate,
      endDate,
      status: 'In Progress',
      verifiedAssets: []
    };

    setAudits(prev => [newCycle, ...prev]);
    logActivity('status_change', 'Audit Cycle Created', `New audit "${cycleName}" created.`);
    return newCycle;
  };

  const verifyAuditAsset = (cycleId, assetId, status, notes) => {
    setAudits(prev => prev.map(cycle => {
      if (cycle.id === cycleId) {
        const existingIdx = cycle.verifiedAssets.findIndex(va => va.assetId === assetId);
        let updatedList = [...cycle.verifiedAssets];
        
        const verificationEntry = {
          assetId,
          status, // Verified, Damaged, Missing
          notes,
          verifiedDate: new Date().toISOString().split('T')[0]
        };

        if (existingIdx > -1) {
          updatedList[existingIdx] = verificationEntry;
        } else {
          updatedList.push(verificationEntry);
        }

        // Auto update asset condition based on audit
        if (status === 'Damaged') {
          const asset = assets.find(a => a.id === assetId);
          if (asset) {
            updateAsset({ ...asset, condition: 'Poor', status: 'Under Maintenance' });
          }
        } else if (status === 'Missing') {
          const asset = assets.find(a => a.id === assetId);
          if (asset) {
            updateAsset({ ...asset, status: 'Archived' });
          }
        }

        return {
          ...cycle,
          verifiedAssets: updatedList
        };
      }
      return cycle;
    }));

    logActivity('status_change', 'Audit Logged', `Asset verified as ${status} in audit.`);
  };

  // Notifications
  const createNotification = (type, title, message) => {
    const newNotif = {
      id: `ntf-${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDatabase = () => {
    localStorage.removeItem('assetflow_assets');
    localStorage.removeItem('assetflow_employees');
    localStorage.removeItem('assetflow_departments');
    localStorage.removeItem('assetflow_categories');
    localStorage.removeItem('assetflow_activities');
    localStorage.removeItem('assetflow_user');
    localStorage.removeItem('assetflow_allocations');
    localStorage.removeItem('assetflow_transfers');
    localStorage.removeItem('assetflow_bookings');
    localStorage.removeItem('assetflow_maintenance');
    localStorage.removeItem('assetflow_audits');
    localStorage.removeItem('assetflow_notifications');
    
    setAssets(initialAssets);
    setEmployees(initialEmployees);
    setDepartments(initialDepartments);
    setCategories(initialCategories);
    setActivities(mockActivities);
    setAllocations(initialAllocations);
    setTransfers(initialTransfers);
    setBookings(initialBookings);
    setMaintenance(initialMaintenance);
    setAudits(initialAudits);
    setNotifications(initialNotifications);
    setCurrentUser({
      name: 'David Miller',
      email: 'david.m@assetflow.com',
      role: 'IT Manager',
      avatar: 'DM',
      phone: '+1 (555) 019-5821',
      joiningDate: '2022-08-01',
      notifications: {
        emailAlerts: true,
        pushNotifications: false,
        weeklyDigest: true
      }
    });
  };

  return (
    <MockStateContext.Provider value={{
      assets,
      employees,
      departments,
      categories,
      activities,
      currentUser,
      setCurrentUser,
      allocations,
      transfers,
      bookings,
      maintenance,
      audits,
      notifications,
      allocateAsset,
      returnAsset,
      requestTransfer,
      approveTransfer,
      rejectTransfer,
      createBooking,
      cancelBooking,
      rescheduleBooking,
      raiseMaintenance,
      updateMaintenanceStatus,
      createAuditCycle,
      verifyAuditAsset,
      createNotification,
      markNotificationRead,
      markAllNotificationsRead,
      addAsset,
      updateAsset,
      deleteAsset,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addCategory,
      updateCategory,
      deleteCategory,
      resetDatabase,
      logActivity,
      loadFromApi,
      isLoadingData,
    }}>
      {children}
    </MockStateContext.Provider>
  );
}

export function useMockState() {
  const context = useContext(MockStateContext);
  if (!context) {
    throw new Error('useMockState must be used within a MockStateProvider');
  }
  return context;
}
