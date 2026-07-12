import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Search, FolderTree, Landmark } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import DangerButton from '../../components/ui/buttons/DangerButton';
import SearchInput from '../../components/ui/inputs/SearchInput';
import TextInput from '../../components/ui/inputs/TextInput';
import Textarea from '../../components/ui/inputs/Textarea';
import Select from '../../components/ui/inputs/Select';
import Modal from '../../components/ui/modals/Modal';
import Badge from '../../components/ui/badges/Badge';
import Pagination from '../../components/ui/common/Pagination';
import EmptyState from '../../components/ui/common/EmptyState';

export default function Departments() {
  const {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment
  } = useMockState();

  // Search & Pagination State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeDept, setActiveDept] = useState(null);

  // Forms setup
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

  // Search filter
  const filteredDepartments = React.useMemo(() => {
    return departments.filter(d => 
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      (d.manager || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  // Paginated slices
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepts = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDepartments.slice(start, start + itemsPerPage);
  }, [filteredDepartments, currentPage]);

  const onAddSubmit = async (data) => {
    try {
      await addDepartment({
        name: data.name,
        code: data.code.toUpperCase(),
        manager: data.manager,
        budget: data.budget,
        description: data.description,
        status: data.status
      });
      setAddOpen(false);
      resetAdd();
      toast.success('Department created successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to create department');
    }
  };

  const onEditSubmit = async (data) => {
    try {
      await updateDepartment({
        id: activeDept.id,
        name: data.name,
        code: data.code.toUpperCase(),
        manager: data.manager,
        budget: data.budget,
        description: data.description,
        status: data.status
      });
      setEditOpen(false);
      toast.success('Department details updated!');
    } catch (error) {
      toast.error(error.message || 'Failed to update department');
    }
  };

  const openEditModal = (dept) => {
    setActiveDept(dept);
    setEditValue('name', dept.name);
    setEditValue('code', dept.code);
    setEditValue('manager', dept.manager);
    setEditValue('budget', dept.budget);
    setEditValue('description', dept.description);
    setEditValue('status', dept.status);
    setEditOpen(true);
  };

  const openDeleteModal = (dept) => {
    setActiveDept(dept);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDepartment(activeDept.id);
      setDeleteOpen(false);
      toast.success('Department removed successfully.');
    } catch (error) {
      toast.error(error.message || 'Failed to delete department');
    }
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Departments</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Manage organizational divisions, budgets, and managers.</p>
        </div>
        <PrimaryButton className="text-xs" icon={Plus} onClick={() => setAddOpen(true)}>
          Add Department
        </PrimaryButton>
      </div>

      {/* Toolbar Search */}
      <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          onClear={() => setSearch('')}
          placeholder="Search by name, code, or manager..."
          className="w-full max-w-sm"
        />
      </div>

      {/* Data Table */}
      {filteredDepartments.length > 0 ? (
        <div className="glass-panel border border-brand-border/40 rounded-2xl overflow-hidden shadow-premium">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border/30 text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider bg-slate-900/20">
                  <th className="py-4 px-6">Department Name</th>
                  <th className="py-4 px-6">Code</th>
                  <th className="py-4 px-6">Manager</th>
                  <th className="py-4 px-6">Staff Count</th>
                  <th className="py-4 px-6">Allocated Budget</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/10 text-xs text-brand-secondaryText font-semibold">
                {paginatedDepts.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg border border-brand-primary/20">
                          <FolderTree className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="text-white block font-bold">{d.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium block mt-0.5 max-w-[200px] truncate">{d.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className="font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-brand-border/30">{d.code}</span>
                    </td>
                    <td className="py-4.5 px-6 text-white">{d.manager}</td>
                    <td className="py-4.5 px-6">
                      <span className="bg-brand-purple/10 text-indigo-400 border border-brand-purple/20 px-2 py-0.5 rounded-full text-[10px]">
                        {d.employeeCount} Members
                      </span>
                    </td>
                    <td className="py-4.5 px-6 font-mono text-white">{d.budget}</td>
                    <td className="py-4.5 px-6">
                      <Badge variant={d.status === 'Active' ? 'success' : 'gray'}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(d)}
                          className="p-1.5 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(d)}
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredDepartments.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : (
        <EmptyState
          title="No departments found"
          description={search ? "We couldn't find matches for your search queries." : "Get started by registering your organization divisions."}
          actionLabel="Create Department"
          onActionClick={() => setAddOpen(true)}
        />
      )}

      {/* ADD DEPARTMENT MODAL */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Create New Department" size="md">
        <form onSubmit={handleAddSubmit(onAddSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Department Name"
            placeholder="e.g. Information Technology"
            error={errorsAdd.name?.message}
            required
            {...registerAdd('name', { required: 'Department name is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Department Code"
              placeholder="e.g. IT"
              error={errorsAdd.code?.message}
              required
              {...registerAdd('code', { required: 'Code is required' })}
            />
            <TextInput
              label="Allocated Budget"
              placeholder="e.g. $75,000"
              error={errorsAdd.budget?.message}
              required
              {...registerAdd('budget', { required: 'Budget amount is required' })}
            />
          </div>

          <TextInput
            label="Department Manager"
            placeholder="e.g. David Miller"
            error={errorsAdd.manager?.message}
            required
            {...registerAdd('manager', { required: 'Manager name is required' })}
          />

          <Select
            label="Initial Status"
            placeholder="Select Status..."
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
            error={errorsAdd.status?.message}
            required
            {...registerAdd('status', { required: 'Status is required' })}
          />

          <Textarea
            label="Description / Purpose"
            placeholder="Outline department duties..."
            error={errorsAdd.description?.message}
            {...registerAdd('description')}
          />

          <div className="flex justify-end gap-3 mt-4">
            <SecondaryButton onClick={() => setAddOpen(false)} className="text-xs">Cancel</SecondaryButton>
            <PrimaryButton type="submit" className="text-xs" icon={Plus}>Create Department</PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* EDIT DEPARTMENT MODAL */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Department Details" size="md">
        <form onSubmit={handleEditSubmit(onEditSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Department Name"
            placeholder="e.g. Information Technology"
            error={errorsEdit.name?.message}
            required
            {...registerEdit('name', { required: 'Department name is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Department Code"
              placeholder="e.g. IT"
              error={errorsEdit.code?.message}
              required
              {...registerEdit('code', { required: 'Code is required' })}
            />
            <TextInput
              label="Allocated Budget"
              placeholder="e.g. $75,000"
              error={errorsEdit.budget?.message}
              required
              {...registerEdit('budget', { required: 'Budget amount is required' })}
            />
          </div>

          <TextInput
            label="Department Manager"
            placeholder="e.g. David Miller"
            error={errorsEdit.manager?.message}
            required
            {...registerEdit('manager', { required: 'Manager name is required' })}
          />

          <Select
            label="Status"
            placeholder="Select Status..."
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
            error={errorsEdit.status?.message}
            required
            {...registerEdit('status', { required: 'Status is required' })}
          />

          <Textarea
            label="Description"
            placeholder="Outline department duties..."
            error={errorsEdit.description?.message}
            {...registerEdit('description')}
          />

          <div className="flex justify-end gap-3 mt-4">
            <SecondaryButton onClick={() => setEditOpen(false)} className="text-xs">Cancel</SecondaryButton>
            <PrimaryButton type="submit" className="text-xs">Save Changes</PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Remove Department" size="sm">
        <div className="flex flex-col gap-4 text-center">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-brand-danger rounded-full w-fit mx-auto">
            <Trash2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Are you absolutely sure?</h4>
            <p className="text-xs text-brand-secondaryText mt-1.5 leading-relaxed">
              This will remove the department <span className="font-semibold text-white">"{activeDept?.name}"</span> from your system records. 
              This action cannot be undone.
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
