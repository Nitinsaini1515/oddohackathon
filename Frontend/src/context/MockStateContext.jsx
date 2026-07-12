import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialAssets,
  initialEmployees,
  initialDepartments,
  initialCategories,
  mockActivities
} from '../data/mockData';

const MockStateContext = createContext(undefined);

export function MockStateProvider({ children }) {
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
  const addAsset = (asset) => {
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
  const addDepartment = (dept) => {
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

  const updateDepartment = (updated) => {
    setDepartments(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } : d));
    logActivity('employee', 'Department Updated', `Department "${updated.name}" updated.`);
  };

  const deleteDepartment = (id) => {
    const target = departments.find(d => d.id === id);
    if (!target) return;
    setDepartments(prev => prev.filter(d => d.id !== id));
    logActivity('employee', 'Department Deleted', `Department "${target.name}" removed.`);
  };

  // Employees
  const addEmployee = (emp) => {
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

  const updateEmployee = (updated) => {
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

  const deleteEmployee = (id) => {
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
  const addCategory = (cat) => {
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

  const resetDatabase = () => {
    localStorage.removeItem('assetflow_assets');
    localStorage.removeItem('assetflow_employees');
    localStorage.removeItem('assetflow_departments');
    localStorage.removeItem('assetflow_categories');
    localStorage.removeItem('assetflow_activities');
    localStorage.removeItem('assetflow_user');
    
    setAssets(initialAssets);
    setEmployees(initialEmployees);
    setDepartments(initialDepartments);
    setCategories(initialCategories);
    setActivities(mockActivities);
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
      logActivity
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
