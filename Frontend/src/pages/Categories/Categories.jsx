import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Folder, Grid, Info } from 'lucide-react';
import { useMockState } from '../../context/MockStateContext';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import SecondaryButton from '../../components/ui/buttons/SecondaryButton';
import DangerButton from '../../components/ui/buttons/DangerButton';
import TextInput from '../../components/ui/inputs/TextInput';
import Textarea from '../../components/ui/inputs/Textarea';
import Select from '../../components/ui/inputs/Select';
import Modal from '../../components/ui/modals/Modal';
import Badge from '../../components/ui/badges/Badge';
import EmptyState from '../../components/ui/common/EmptyState';

export default function Categories() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory
  } = useMockState();

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(null);

  // Form setups
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

  const onAddSubmit = (data) => {
    addCategory({
      name: data.name,
      code: data.code.toUpperCase(),
      description: data.description,
      status: data.status,
      icon: 'Folder'
    });
    setAddOpen(false);
    resetAdd();
    toast.success('Asset category created successfully!');
  };

  const onEditSubmit = (data) => {
    updateCategory({
      id: activeCat.id,
      name: data.name,
      code: data.code.toUpperCase(),
      description: data.description,
      status: data.status
    });
    setEditOpen(false);
    toast.success('Category details updated!');
  };

  const openEditModal = (cat) => {
    setActiveCat(cat);
    setEditValue('name', cat.name);
    setEditValue('code', cat.code);
    setEditValue('description', cat.description);
    setEditValue('status', cat.status);
    setEditOpen(true);
  };

  const openDeleteModal = (cat) => {
    setActiveCat(cat);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteCategory(activeCat.id);
    setDeleteOpen(false);
    toast.success('Category removed successfully.');
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Asset Categories</h2>
          <p className="text-xs text-brand-secondaryText mt-1">Classify organizational assets and track values per group.</p>
        </div>
        <PrimaryButton className="text-xs" icon={Plus} onClick={() => setAddOpen(true)}>
          Create Category
        </PrimaryButton>
      </div>

      {/* Categories Cards Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="glass-panel rounded-2xl p-5 border border-brand-border/40 bg-[#0F172A]/40 flex flex-col justify-between group hover:border-brand-primary/30 transition-all duration-300 relative"
          >
            <div>
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/20">
                  <Grid className="w-5 h-5" />
                </div>
                <Badge variant={cat.status === 'Active' ? 'success' : 'gray'}>
                  {cat.status}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-white mt-4 group-hover:text-brand-primary transition-colors">{cat.name}</h3>
              <p className="text-[11px] text-brand-secondaryText mt-1.5 leading-relaxed line-clamp-2">{cat.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-brand-border/30 text-xs font-semibold text-brand-secondaryText">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Item Count</span>
                <span className="text-white font-bold text-sm block mt-0.5">{cat.itemCount} items</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Est. Value</span>
                <span className="text-white font-bold text-sm block mt-0.5">{cat.totalValue}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <SecondaryButton onClick={() => openEditModal(cat)} className="text-[10px] px-3.5 py-1.5 w-full" icon={Edit2}>
                Edit Details
              </SecondaryButton>
              <button
                onClick={() => openDeleteModal(cat)}
                className="p-2 border border-brand-border bg-red-950/10 hover:bg-brand-danger/20 text-brand-danger rounded-xl transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Table List */}
      {categories.length > 0 ? (
        <div className="glass-panel border border-brand-border/40 rounded-2xl overflow-hidden shadow-premium mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-border/30 text-[10px] font-bold text-brand-secondaryText uppercase tracking-wider bg-slate-900/20">
                  <th className="py-4 px-6">Category Name</th>
                  <th className="py-4 px-6">Classification Code</th>
                  <th className="py-4 px-6">Stock Size</th>
                  <th className="py-4 px-6">Estimated Valuation</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/10 text-xs text-brand-secondaryText font-semibold">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-lg border border-brand-primary/20">
                          <Folder className="w-4 h-4" />
                        </div>
                        <span className="text-white font-bold">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-brand-border/30">{c.code}</span>
                    </td>
                    <td className="py-4 px-6 text-white">{c.itemCount} items</td>
                    <td className="py-4 px-6 font-mono text-white">{c.totalValue}</td>
                    <td className="py-4 px-6">
                      <Badge variant={c.status === 'Active' ? 'success' : 'gray'}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 border border-brand-border bg-slate-900/40 hover:bg-brand-cardHover hover:text-white rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(c)}
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
      ) : (
        <EmptyState
          title="No Categories Available"
          description="Definitions organize assets for reports and lifecycle telemetry charts."
          actionLabel="Create Category"
          onActionClick={() => setAddOpen(true)}
        />
      )}

      {/* 1. ADD CATEGORY MODAL */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Create Asset Category" size="md">
        <form onSubmit={handleAddSubmit(onAddSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Category Name"
            placeholder="e.g. Laptops & Workstations"
            error={errorsAdd.name?.message}
            required
            {...registerAdd('name', { required: 'Category name is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Classification Code"
              placeholder="e.g. LAP"
              error={errorsAdd.code?.message}
              required
              {...registerAdd('code', { required: 'Code is required' })}
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
          </div>

          <Textarea
            label="Description / Scope"
            placeholder="Details about items included in this group..."
            error={errorsAdd.description?.message}
            {...registerAdd('description')}
          />

          <div className="flex justify-end gap-3 mt-4">
            <SecondaryButton onClick={() => setAddOpen(false)} className="text-xs">Cancel</SecondaryButton>
            <PrimaryButton type="submit" className="text-xs" icon={Plus}>Create Category</PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* 2. EDIT CATEGORY MODAL */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Category Details" size="md">
        <form onSubmit={handleEditSubmit(onEditSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Category Name"
            placeholder="e.g. Laptops & Workstations"
            error={errorsEdit.name?.message}
            required
            {...registerEdit('name', { required: 'Category name is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Classification Code"
              placeholder="e.g. LAP"
              error={errorsEdit.code?.message}
              required
              {...registerEdit('code', { required: 'Code is required' })}
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
          </div>

          <Textarea
            label="Description"
            placeholder="Details about items included in this group..."
            error={errorsEdit.description?.message}
            {...registerEdit('description')}
          />

          <div className="flex justify-end gap-3 mt-4">
            <SecondaryButton onClick={() => setEditOpen(false)} className="text-xs">Cancel</SecondaryButton>
            <PrimaryButton type="submit" className="text-xs">Save Changes</PrimaryButton>
          </div>
        </form>
      </Modal>

      {/* 3. DELETE CONFIRM MODAL */}
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Remove Category" size="sm">
        <div className="flex flex-col gap-4 text-center">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-brand-danger rounded-full w-fit mx-auto">
            <Trash2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">De-register Category?</h4>
            <p className="text-xs text-brand-secondaryText mt-1.5 leading-relaxed">
              This will remove <span className="font-semibold text-white">"{activeCat?.name}"</span>. 
              Any active assets categorized under this group will not be deleted but will lose their classification references.
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
