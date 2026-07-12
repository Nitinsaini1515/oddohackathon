import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Grid as GridIcon,
  List as ListIcon,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Eye,
  Laptop
} from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import DangerButton from '../../components/ui/buttons/DangerButton';
import SearchInput from '../../components/ui/inputs/SearchInput';
import TextInput from '../../components/ui/inputs/TextInput';
import Select from '../../components/ui/inputs/Select';
import Modal from '../../components/ui/modals/Modal';
import Badge from '../../components/ui/badges/Badge';
import Avatar from '../../components/ui/avatars/Avatar';
import Pagination from '../../components/ui/common/Pagination';
import EmptyState from '../../components/ui/common/EmptyState';

export default function Employees() {
  const {
    employees,
    departments,
    assets,
    addEmployee,
    updateEmployee,
    deleteEmployee
  } = useMockState();

  // Search, Filter & Layout View states
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const [activeEmployee, setActiveEmployee] = useState(null);

  // React Hook Form setups
  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: errorsAdd }
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    formState: { errors: errorsEdit }
  } = useForm();

  // Filters logic
  const filteredEmployees = React.useMemo(() => {
    return employees.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter ? e.department === deptFilter : true;
      return matchSearch && matchDept;
    });
  }, [employees, search, deptFilter]);

  // Paginated slices
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(start, start + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const onAddSubmit = (data) => {
    addEmployee({
      name: data.name,
      email: data.email,
      department: data.department,
      role: data.role,
      status: data.status,
      phone: data.phone,
      joiningDate: data.joiningDate
    });
    setAddOpen(false);
    resetAdd();
    toast.success('Employee profile created!');
  };

  const onEditSubmit = (data) => {
    updateEmployee({
      id: activeEmployee.id,
      name: data.name,
      email: data.email,
      department: data.department,
      role: data.role,
      status: data.status,
      phone: data.phone,
      joiningDate: data.joiningDate
    });
    setEditOpen(false);
    toast.success('Employee profile updated!');
  };

  const openEditModal = (emp) => {
    setActiveEmployee(emp);
    setEditValue('name', emp.name);
    setEditValue('email', emp.email);
    setEditValue('department', emp.department);
    setEditValue('role', emp.role);
    setEditValue('status', emp.status);
    setEditValue('phone', emp.phone);
    setEditValue('joiningDate', emp.joiningDate);
    setEditOpen(true);
  };

  const openDeleteModal = (emp) => {
    setActiveEmployee(emp);
    setDeleteOpen(true);
  };

  const openProfileModal = (emp) => {
    setActiveEmployee(emp);
    setProfileOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteEmployee(activeEmployee.id);
    setDeleteOpen(false);
    toast.success('Employee profile removed successfully.');
  };

  // Get active assets assigned to active employee
  const activeEmployeeAssets = React.useMemo(() => {
    if (!activeEmployee) return [];
    return assets.filter(a => a.currentHolderId === activeEmployee.id);
  }, [activeEmployee, assets]);

  // Dept Options mapping
  const departmentOptions = departments.map(d => ({ value: d.name, label: d.name }));

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Employees</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Onboard staff, assign roles, and audit hardware assignment folders.</p>
        </div>
        <PrimaryButton className="text-xs" icon={Plus} onClick={() => setAddOpen(true)}>
          Onboard Employee
        </PrimaryButton>
      </div>

      {/* Toolbar Search / Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <SearchInput
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            onClear={() => setSearch('')}
            placeholder="Search employees..."
            className="w-full sm:w-64"
          />
          <Select
            placeholder="All Departments"
            options={departmentOptions}
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-48 text-xs py-2 bg-slate-900/60"
          />
        </div>

        {/* View togglers */}
        <div className="flex items-center gap-1.5 border border-brand-border bg-slate-950/40 rounded-xl p-1 w-fit">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-primary text-white shadow-glow-primary' : 'text-brand-secondaryText hover:text-white'}`}
          >
            <GridIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-brand-primary text-white shadow-glow-primary' : 'text-brand-secondaryText hover:text-white'}`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid or Table view */}
      {filteredEmployees.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="glass-panel rounded-2xl p-5 border border-brand-border/40 bg-[#0F172A]/40 flex flex-col justify-between group hover:border-brand-primary/30 transition-all duration-300 relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} size="lg" />
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-brand-primary transition-colors">{emp.name}</h4>
                        <span className="text-[10px] text-brand-secondaryText font-medium block mt-0.5">{emp.role} • {emp.department}</span>
                      </div>
                    </div>
                    <Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'On Leave' ? 'warning' : 'gray'}>
                      {emp.status}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-2 mt-5 text-[11px] text-brand-secondaryText font-semibold border-t border-brand-border/30 pt-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-600" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span>{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Laptop className="w-3.5 h-3.5 text-brand-primary" />
                      <span className="text-white font-bold">{emp.assignedAssetsCount} Assigned Assets</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <SecondaryButton onClick={() => openProfileModal(emp)} className="text-[10px] px-3.5 py-1.5 w-full" icon={Eye}>
                      Inspect Profile
                    </SecondaryButton>
                    <button
                      onClick={() => openEditModal(emp)}
                      className="p-2 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-xl transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(emp)}
                      className="p-2 border border-brand-border bg-red-950/10 hover:bg-brand-danger/20 text-brand-danger rounded-xl transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="glass-panel border border-brand-border/40 rounded-2xl overflow-hidden shadow-premium">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-border/30 text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider bg-slate-900/20">
                      <th className="py-4 px-6">Employee</th>
                      <th className="py-4 px-6">Department</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Contact Email</th>
                      <th className="py-4 px-6">Assets</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/10 text-xs text-brand-secondaryText font-semibold">
                    {paginatedEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar name={emp.name} size="md" />
                            <span className="text-white font-bold block">{emp.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-white">{emp.department}</td>
                        <td className="py-4 px-6">{emp.role}</td>
                        <td className="py-4 px-6 font-mono text-[11px]">{emp.email}</td>
                        <td className="py-4 px-6">
                          <Badge variant="primary">{emp.assignedAssetsCount} items</Badge>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'On Leave' ? 'warning' : 'gray'}>
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openProfileModal(emp)}
                              className="p-1.5 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-lg transition-all"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(emp)}
                              className="p-1.5 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-lg transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(emp)}
                              className="p-1.5 border border-brand-border bg-red-950/10 hover:bg-brand-danger/20 text-brand-danger rounded-lg transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredEmployees.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      ) : (
        <EmptyState
          title="No employees found"
          description={search || deptFilter ? "Try adjusting your search queries or department filter inputs." : "Begin logging organization team members."}
          actionLabel="Onboard Employee"
          onActionClick={() => setAddOpen(true)}
        />
      )}

      {/* 1. ADD EMPLOYEE MODAL */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Register Employee Profile" size="md">
        <form onSubmit={handleAddSubmit(onAddSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Full Name"
            placeholder="e.g. Sarah Jenkins"
            error={errorsAdd.name?.message}
            required
            {...registerAdd('name', { required: 'Name is required' })}
          />

          <TextInput
            label="Email Address"
            type="email"
            placeholder="e.g. sarah.j@assetflow.com"
            error={errorsAdd.email?.message}
            required
            {...registerAdd('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              placeholder="Select department..."
              options={departmentOptions}
              error={errorsAdd.department?.message}
              required
              {...registerAdd('department', { required: 'Department is required' })}
            />
            <Select
              label="Staff Role"
              placeholder="Select role..."
              options={[
                { value: 'Manager', label: 'Manager' },
                { value: 'Team Lead', label: 'Team Lead' },
                { value: 'Engineer', label: 'Engineer' },
                { value: 'Analyst', label: 'Analyst' },
                { value: 'Admin', label: 'Admin' }
              ]}
              error={errorsAdd.role?.message}
              required
              {...registerAdd('role', { required: 'Role is required' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Phone Number"
              placeholder="e.g. +1 (555) 019-2834"
              error={errorsAdd.phone?.message}
              required
              {...registerAdd('phone', { required: 'Phone is required' })}
            />
            <TextInput
              label="Date of Joining"
              type="date"
              error={errorsAdd.joiningDate?.message}
              required
              {...registerAdd('joiningDate', { required: 'Joining date is required' })}
            />
          </div>

          <Select
            label="Status"
            placeholder="Select Status..."
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'On Leave', label: 'On Leave' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
            error={errorsAdd.status?.message}
            required
            {...registerAdd('status', { required: 'Status is required' })}
          />

          <div className="flex justify-end gap-3 mt-4">
            <SecondaryButton onClick={() => setAddOpen(false)} className="text-xs">Cancel</SecondaryButton>
            <PrimaryButton type="submit" className="text-xs" icon={Plus}>Onboard Employee</PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* 2. EDIT EMPLOYEE MODAL */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Modify Employee Profile" size="md">
        <form onSubmit={handleEditSubmit(onEditSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Full Name"
            placeholder="e.g. Sarah Jenkins"
            error={errorsEdit.name?.message}
            required
            {...registerEdit('name', { required: 'Name is required' })}
          />

          <TextInput
            label="Email Address"
            type="email"
            placeholder="e.g. sarah.j@assetflow.com"
            error={errorsEdit.email?.message}
            required
            {...registerEdit('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              placeholder="Select department..."
              options={departmentOptions}
              error={errorsEdit.department?.message}
              required
              {...registerEdit('department', { required: 'Department is required' })}
            />
            <Select
              label="Staff Role"
              placeholder="Select role..."
              options={[
                { value: 'Manager', label: 'Manager' },
                { value: 'Team Lead', label: 'Team Lead' },
                { value: 'Engineer', label: 'Engineer' },
                { value: 'Analyst', label: 'Analyst' },
                { value: 'Admin', label: 'Admin' }
              ]}
              error={errorsEdit.role?.message}
              required
              {...registerEdit('role', { required: 'Role is required' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Phone Number"
              placeholder="e.g. +1 (555) 019-2834"
              error={errorsEdit.phone?.message}
              required
              {...registerEdit('phone', { required: 'Phone is required' })}
            />
            <TextInput
              label="Date of Joining"
              type="date"
              error={errorsEdit.joiningDate?.message}
              required
              {...registerEdit('joiningDate', { required: 'Joining date is required' })}
            />
          </div>

          <Select
            label="Status"
            placeholder="Select Status..."
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'On Leave', label: 'On Leave' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
            error={errorsEdit.status?.message}
            required
            {...registerEdit('status', { required: 'Status is required' })}
          />

          <div className="flex justify-end gap-3 mt-4">
            <SecondaryButton onClick={() => setEditOpen(false)} className="text-xs">Cancel</SecondaryButton>
            <PrimaryButton type="submit" className="text-xs">Save Changes</PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* 3. PROFILE MODAL (DETAILS INSPECTION) */}
      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)} title="Employee Resource Card" size="md">
        {activeEmployee && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-brand-border/30 pb-4.5">
              <Avatar name={activeEmployee.name} size="xl" />
              <div>
                <h3 className="text-base font-bold text-white leading-tight">{activeEmployee.name}</h3>
                <p className="text-xs text-brand-secondaryText mt-1.5">{activeEmployee.role} • {activeEmployee.department}</p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <Badge variant={activeEmployee.status === 'Active' ? 'success' : activeEmployee.status === 'On Leave' ? 'warning' : 'gray'}>
                    {activeEmployee.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-brand-secondaryText">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-slate-600" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-white mt-0.5">{activeEmployee.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-slate-600" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Phone</p>
                  <p className="text-white mt-0.5">{activeEmployee.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Calendar className="w-4.5 h-4.5 text-slate-600" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Onboarding Date</p>
                  <p className="text-white mt-0.5">{activeEmployee.joiningDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4.5 h-4.5 text-slate-600" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Employee ID</p>
                  <p className="text-white mt-0.5 font-mono">{activeEmployee.id.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Assigned Assets subtable */}
            <div className="border-t border-brand-border/30 pt-5">
              <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3.5">
                <Laptop className="w-4.5 h-4.5 text-brand-primary" /> Active Hardware Allocations
              </h4>
              {activeEmployeeAssets.length > 0 ? (
                <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                  {activeEmployeeAssets.map(a => (
                    <div key={a.id} className="flex justify-between items-center p-3 bg-slate-950/40 border border-brand-border/40 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-white block">{a.name}</span>
                        <span className="text-[10px] text-brand-secondaryText font-mono block mt-0.5">{a.assetTag}</span>
                      </div>
                      <Badge variant={a.condition === 'New' || a.condition === 'Good' ? 'success' : 'warning'}>
                        {a.condition}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-brand-border/40 rounded-xl text-xs text-brand-secondaryText bg-slate-950/10">
                  No active equipment assigned to this employee.
                </div>
              )}
            </div>

            <div className="flex justify-end mt-2">
              <SecondaryButton onClick={() => setProfileOpen(false)} className="text-xs">Close Profile</SecondaryButton>
            </div>
          </div>
        )}
      </Modal>

      {/* 4. DELETE CONFIRM MODAL */}
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="De-authorize Employee" size="sm">
        <div className="flex flex-col gap-4 text-center">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-brand-danger rounded-full w-fit mx-auto">
            <Trash2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">De-authorize Employee?</h4>
            <p className="text-xs text-brand-secondaryText mt-1.5 leading-relaxed">
              This will remove <span className="font-semibold text-white">"{activeEmployee?.name}"</span> from the ERP databases. 
              Any active assets assigned to this member will be unallocated and returned to available stock.
            </p>
          </div>
          <div className="flex gap-3.5 mt-4">
            <SecondaryButton onClick={() => setDeleteOpen(false)} className="w-full text-xs">Cancel</SecondaryButton>
            <DangerButton onClick={handleDeleteConfirm} className="w-full text-xs">Confirm Delete</DangerButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
